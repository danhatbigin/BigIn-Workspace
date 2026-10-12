import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createOpClient } from './client';
import { parseIsoDuration } from './duration';
import { OpError } from './errors';
import { shortfallFromOp } from './shortfall';

// Toàn bộ fixture TỰ SOẠN, ẩn danh: id số giả, không tên/email/comment thật. KEY chỉ là chuỗi giả để kiểm tra không bị rò.
const KEY = 'fake-test-key-0000';
const BASE = 'https://op.example.test';
const ME = 100, OTHER = 200;

type Raw = { id: number; spentOn: string; hours: string; user: number; wp?: number };
let nextId = 1;
const raw = (spentOn: string, hours: string, user = ME, wp: number | undefined = 7): Raw => ({ id: nextId++, spentOn, hours, user, wp });
const el = (r: Raw) => ({
  id: r.id, spentOn: r.spentOn, hours: r.hours,
  _links: { user: { href: `/api/v3/users/${r.user}` }, project: { href: '/api/v3/projects/5' }, ...(r.wp ? { workPackage: { href: `/api/v3/work_packages/${r.wp}` } } : {}) },
});

// Tháng 10 của owner: 01=12h, 02=16h, 05=13h, 06–09=14h/ngày; tổng 97h / 16 entry.
function october(): Raw[] {
  return [
    raw('2026-10-01', 'PT8H'), raw('2026-10-01', 'PT3H'), raw('2026-10-01', 'PT1H'),
    raw('2026-10-02', 'PT8H'), raw('2026-10-02', 'PT5H', ME, 8), raw('2026-10-02', 'PT3H'),
    raw('2026-10-05', 'PT8H'), raw('2026-10-05', 'PT5H', ME, undefined),
    ...['06', '07', '08', '09'].flatMap(d => [raw(`2026-10-${d}`, 'PT8H'), raw(`2026-10-${d}`, 'PT6H', ME, 9)]),
  ];
}

type Call = { method?: string; url: URL; headers: Record<string, string> };
// Server giả: lọc spentOn, phân trang theo SỐ TRANG từ 1. leakForeign=true mô phỏng server vô tình trả entry của người khác.
function fakeServer(data: Raw[], opts: { leakForeign?: boolean; failPage?: number; failStatus?: number; meId?: number } = {}) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: any, init: any) => {
    const url = new URL(String(input));
    calls.push({ method: init?.method, url, headers: init?.headers ?? {} });
    if (url.pathname === '/api/v3/users/me') return Response.json({ id: opts.meId ?? ME, name: 'Người dùng thử' });
    if (url.pathname !== '/api/v3/time_entries') return new Response('', { status: 404 });
    const filters = JSON.parse(url.searchParams.get('filters') ?? '[]');
    const [from, to] = filters.find((f: any) => f.spentOn).spentOn.values;
    const wantMe = filters.some((f: any) => f.user?.values?.includes('me'));
    const pageSize = Number(url.searchParams.get('pageSize')); const page = Number(url.searchParams.get('offset'));
    if (opts.failPage === page) return new Response('lỗi nội bộ chứa dữ liệu nhạy cảm', { status: opts.failStatus ?? 500 });
    const rows = data.filter(r => r.spentOn >= from && r.spentOn <= to && (!wantMe || opts.leakForeign || r.user === ME));
    const slice = rows.slice((page - 1) * pageSize, page * pageSize);
    return Response.json({ total: rows.length, count: slice.length, pageSize, offset: page, _embedded: { elements: slice.map(el) } });
  }) as typeof fetch;
  return { fetchImpl, calls };
}
const client = (fetchImpl: typeof fetch, extra = {}) => createOpClient({ baseUrl: BASE, apiKey: KEY, fetchImpl, ...extra });
const weekdays = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  .filter(d => { const dow = new Date(`2026-10-${String(d).padStart(2, '0')}T12:00:00`).getDay(); return dow !== 0 && dow !== 6; })
  .map(d => `2026-10-${String(d).padStart(2, '0')}`);
const failure = async (p: Promise<unknown>) => { try { await p; } catch (e) { return e as OpError; } throw new Error('expected failure'); };

describe('parseIsoDuration', () => {
  it('parses OP hour formats', () => {
    expect(parseIsoDuration('PT8H')).toBe(8);
    expect(parseIsoDuration('PT15M')).toBe(0.25);
    expect(parseIsoDuration('PT1H30M')).toBe(1.5);
    expect(parseIsoDuration('PT45S')).toBe(0.0125);
    expect(parseIsoDuration('PT0.5H')).toBe(0.5);
    expect(parseIsoDuration('PT16H')).toBe(16);
  });
  it('rejects anything ambiguous or malformed', () => {
    for (const bad of ['', 'PT', 'P1D', 'PT-1H', '8', '8h', 'pt8h', 'PT8X', null, undefined, 8])
      expect(() => parseIsoDuration(bad)).toThrow(OpError);
  });
});

describe('time entries: tháng 10 của owner (LT-01-R01, không bù)', () => {
  it('đọc đủ 16 entry / 97h và tính thiếu từng ngày', async () => {
    const { fetchImpl } = fakeServer(october());
    const result = await client(fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.status).toBe('complete');
    expect(result.entries).toHaveLength(16);
    expect(result.entries.reduce((s, e) => s + e.hours, 0)).toBe(97);
    // 01–12/10 theo lịch T2–T6 (chỉ là đầu vào test, không phải policy P-01). 12/10 chưa log.
    const s = shortfallFromOp(result, weekdays(1, 12));
    expect(Object.fromEntries(s.days.map(d => [d.date.slice(8), d.hours]))).toEqual({ '01': 12, '02': 16, '05': 13, '06': 14, '07': 14, '08': 14, '09': 14, '12': 0 });
    expect(s.days.find(d => d.date === '2026-10-12')!.missing).toBe(8);
    expect(s.missingTotal).toBe(8);
    expect(s.loggedTotal).toBe(97);
    expect(s.reliable).toBe(true);
    expect('label' in s.days[0]).toBe(false); // chưa gắn nhãn 8/12/16
  });
  it('ngày chưa log không được bù bằng ngày log dư', async () => {
    const data = october().filter(r => r.spentOn !== '2026-10-07');
    const result = await client(fakeServer(data).fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31');
    const s = shortfallFromOp(result, weekdays(5, 9));
    expect(s.days.find(d => d.date === '2026-10-07')).toEqual({ date: '2026-10-07', hours: 0, missing: 8 });
    expect(s.missingTotal).toBe(8); // 13+14+0+14+14 giờ dư không bù được ngày 07
  });
  it('ngày log thiếu (6h) vẫn thiếu 2h dù ngày khác dư', async () => {
    const data = [raw('2026-10-05', 'PT6H'), raw('2026-10-06', 'PT10H')];
    const result = await client(fakeServer(data).fetchImpl).getMyTimeEntries('2026-10-05', '2026-10-06');
    expect(shortfallFromOp(result, ['2026-10-05', '2026-10-06']).missingTotal).toBe(2);
  });
});

describe('truy vấn và phân trang', () => {
  it('chỉ GET, luôn lọc user=me + spentOn, pageSize ≤100, offset là số trang từ 1, đi hết các trang', async () => {
    const { fetchImpl, calls } = fakeServer(october());
    const result = await client(fetchImpl, { pageSize: 5 }).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.pagesFetched).toBe(4);
    expect(result.entries).toHaveLength(16);
    expect(calls.every(c => c.method === 'GET')).toBe(true);
    const te = calls.filter(c => c.url.pathname === '/api/v3/time_entries');
    expect(te.map(c => c.url.searchParams.get('offset'))).toEqual(['1', '2', '3', '4']);
    for (const c of te) {
      expect(Number(c.url.searchParams.get('pageSize'))).toBeLessThanOrEqual(100);
      const f = JSON.parse(c.url.searchParams.get('filters')!);
      expect(f).toContainEqual({ user: { operator: '=', values: ['me'] } });
      expect(f).toContainEqual({ spentOn: { operator: '<>d', values: ['2026-10-01', '2026-10-31'] } });
    }
    expect(calls[0].url.pathname).toBe('/api/v3/users/me');
  });
  it('pageSize cấu hình quá 100 bị kẹp về 100', async () => {
    const { fetchImpl, calls } = fakeServer(october());
    await client(fetchImpl, { pageSize: 500 }).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(calls.find(c => c.url.pathname === '/api/v3/time_entries')!.url.searchParams.get('pageSize')).toBe('100');
  });
  it('Authorization chỉ nằm ở header (Basic apikey:KEY), không nằm trong URL', async () => {
    const { fetchImpl, calls } = fakeServer(october());
    await client(fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31');
    const expected = 'Basic ' + Buffer.from(`apikey:${KEY}`).toString('base64');
    for (const c of calls) { expect(c.headers.Authorization).toBe(expected); expect(c.url.href).not.toContain(KEY); }
  });
  it('entry của người khác lẫn vào bị loại và được đếm', async () => {
    const data = [...october(), raw('2026-10-06', 'PT8H', OTHER), raw('2026-10-08', 'PT20H', OTHER)];
    const result = await client(fakeServer(data, { leakForeign: true }).fetchImpl, { pageSize: 7 }).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.entries).toHaveLength(16);
    expect(result.excludedForeign).toBe(2);
    expect(result.entries.reduce((s, e) => s + e.hours, 0)).toBe(97);
  });
  it('entry trùng id giữa các trang chỉ tính một lần', async () => {
    const data = october();
    const base = fakeServer(data).fetchImpl;
    let served = 0;
    const dup = (async (input: any, init: any) => {
      const res = await base(input, init);
      if (!String(input).includes('time_entries')) return res;
      const body = await res.json(); served++;
      if (served === 2) body._embedded.elements.unshift(body._embedded.elements[0]);
      body.total = body.total + (served === 2 ? 1 : 0);
      return Response.json(body);
    }) as typeof fetch;
    const result = await client(dup, { pageSize: 8 }).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.entries).toHaveLength(16);
  });
  it('khoảng ngày sai bị từ chối trước khi gọi mạng', async () => {
    const { fetchImpl, calls } = fakeServer([]);
    for (const [a, b] of [['2026-10-31', '2026-10-01'], ['10/01/2026', '2026-10-31'], ['', '']])
      expect((await failure(client(fetchImpl).getMyTimeEntries(a, b))).kind).toBe('invalid_config');
    expect(calls).toHaveLength(0);
  });
});

describe('partial', () => {
  it('trang sau lỗi → partial, giữ phần đã đọc, đánh dấu không đáng tin', async () => {
    const result = await client(fakeServer(october(), { failPage: 2 }).fetchImpl, { pageSize: 5 }).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.status).toBe('partial');
    expect(result.entries).toHaveLength(5);
    expect(result.error?.kind).toBe('server');
    expect(shortfallFromOp(result, weekdays(1, 9)).reliable).toBe(false);
  });
  it('server trả trang rỗng trước khi đủ total → partial', async () => {
    const base = fakeServer(october()).fetchImpl;
    const lying = (async (input: any, init: any) => {
      const res = await base(input, init);
      if (!String(input).includes('time_entries')) return res;
      const body = await res.json(); body.total = 40; return Response.json(body);
    }) as typeof fetch;
    const result = await client(lying).getMyTimeEntries('2026-10-01', '2026-10-31');
    expect(result.status).toBe('partial');
    expect(result.error?.kind).toBe('bad_response');
  });
  it('lỗi ngay trang đầu thì ném lỗi, không trả partial rỗng', async () => {
    const e = await failure(client(fakeServer(october(), { failPage: 1 }).fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31'));
    expect(e.kind).toBe('server');
  });
});

describe('phân loại lỗi và không rò key', () => {
  const respond = (make: () => Response | Promise<Response>) => (async () => make()) as unknown as typeof fetch;
  const cases: [string, typeof fetch, string][] = [
    ['401', respond(() => new Response('{"message":"x"}', { status: 401 })), 'unauthorized'],
    ['403', respond(() => new Response('', { status: 403 })), 'forbidden'],
    ['404', respond(() => new Response('', { status: 404 })), 'not_found'],
    ['429', respond(() => new Response('', { status: 429, headers: { 'retry-after': '30' } })), 'rate_limited'],
    ['500', respond(() => new Response('', { status: 500 })), 'server'],
    ['503', respond(() => new Response('', { status: 503 })), 'server'],
    ['418', respond(() => new Response('', { status: 418 })), 'http'],
    ['body rỗng', respond(() => new Response('', { status: 200 })), 'empty_body'],
    ['body toàn khoảng trắng', respond(() => new Response('  \n', { status: 200 })), 'empty_body'],
    ['không phải JSON', respond(() => new Response('<html>proxy</html>', { status: 200 })), 'bad_response'],
    ['JSON không phải object', respond(() => new Response('[1]', { status: 200 })), 'bad_response'],
    ['mất mạng', (async () => { throw new TypeError(`fetch failed ${KEY}`); }) as unknown as typeof fetch, 'network'],
    ['timeout', (async () => { throw Object.assign(new Error(`aborted ${KEY}`), { name: 'TimeoutError' }); }) as unknown as typeof fetch, 'timeout'],
  ];
  for (const [name, fetchImpl, kind] of cases) {
    it(`${name} → ${kind}, message/JSON không chứa key`, async () => {
      const e = await failure(client(fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31'));
      expect(e).toBeInstanceOf(OpError);
      expect(e.kind).toBe(kind);
      const blob = [e.message, e.stack ?? '', JSON.stringify(e), String(e), Buffer.from(`apikey:${KEY}`).toString('base64')];
      for (const s of blob.slice(0, 4)) { expect(s).not.toContain(KEY); expect(s).not.toContain(blob[4]); }
    });
  }
  it('429 giữ retry-after; 401 giữ status', async () => {
    const e = await failure(client(respond(() => new Response('', { status: 429, headers: { 'retry-after': '30' } }))).getMe());
    expect(e.retryAfterSeconds).toBe(30);
    expect((await failure(client(respond(() => new Response('', { status: 401 }))).getMe())).status).toBe(401);
  });
  it('users/me thiếu id → bad_response', async () => {
    expect((await failure(client(respond(() => Response.json({ name: 'x' }))).getMe())).kind).toBe('bad_response');
  });
  it('entry hỏng (giờ không hợp lệ) làm hỏng cả lần đọc, không bị bỏ qua thầm lặng', async () => {
    const data = [raw('2026-10-05', 'P1D')];
    expect((await failure(client(fakeServer(data).fetchImpl).getMyTimeEntries('2026-10-01', '2026-10-31'))).kind).toBe('bad_response');
  });
  it('không log gì ra console khi lỗi', async () => {
    const seen: unknown[] = []; const orig = { ...console };
    for (const k of ['log', 'info', 'warn', 'error', 'debug'] as const) console[k] = (...a: unknown[]) => { seen.push(a); };
    try { await failure(client(respond(() => new Response('', { status: 401 }))).getMe()); } finally { Object.assign(console, orig); }
    expect(seen).toEqual([]);
  });
  it('cấu hình sai: http không phải localhost, thiếu key, URL hỏng', () => {
    for (const cfg of [{ baseUrl: 'http://op.example.test', apiKey: KEY }, { baseUrl: BASE, apiKey: '' }, { baseUrl: 'không-phải-url', apiKey: KEY }]) {
      try { createOpClient(cfg); throw new Error('should throw'); } catch (e) { expect(e).toBeInstanceOf(OpError); expect((e as OpError).kind).toBe('invalid_config'); expect(String(e)).not.toContain(KEY); }
    }
  });
});

describe('ranh giới renderer/main', () => {
  it('mã trong apps/web không import packages/op (renderer không giữ key)', () => {
    const dir = path.resolve(__dirname, '../../apps/web/src');
    const offenders = readdirSync(dir).filter(f => /\.(ts|tsx)$/.test(f)).filter(f => /packages\/op|\.\.\/op\//.test(readFileSync(path.join(dir, f), 'utf8')));
    expect(offenders).toEqual([]);
  });
  it('lớp op không có phương thức ghi: chỉ lộ getMe và getMyTimeEntries', () => {
    expect(Object.keys(createOpClient({ baseUrl: BASE, apiKey: KEY })).sort()).toEqual(['getMe', 'getMyTimeEntries']);
  });
});

