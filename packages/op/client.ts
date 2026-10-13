import { OpError, kindForStatus } from './errors';
import { parseIsoDuration } from './duration';

// MAIN/NODE only. Renderer never imports this module. Reads and explicit form/create POSTs.
export type OpConfig = {
  baseUrl: string; apiKey: string;
  fetchImpl?: typeof fetch; timeoutMs?: number; pageSize?: number; maxPages?: number;
};
export type OpTimeEntry = { id: number; date: string; hours: number; workPackageId: number | null; projectId: number | null; note?:string; activityId?:number };
export type TimeEntriesResult = {
  status: 'complete' | 'partial';
  entries: OpTimeEntry[];
  excludedForeign: number;          // entry không thuộc user=me bị loại
  pagesFetched: number;
  error?: OpError;                  // có khi status = 'partial'
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const idFromHref = (href: unknown): number | null => {
  if (typeof href !== 'string') return null;
  const m = /\/(\d+)$/.exec(href);
  return m ? Number(m[1]) : null;
};
const obj = (v: unknown): Record<string, any> | null => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, any> : null);

export function createOpClient(config: OpConfig) {
  let origin: string;
  try {
    const url = new URL(config.baseUrl);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (!config.apiKey || (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))) throw new Error('invalid');
    origin = url.origin;
  } catch { throw new OpError('invalid_config'); }

  const doFetch = config.fetchImpl ?? fetch;
  const timeoutMs = config.timeoutMs ?? 20_000;
  const pageSize = Math.min(Math.max(config.pageSize ?? 100, 1), 100);
  const maxPages = config.maxPages ?? 100;
  const auth = 'Basic ' + Buffer.from(`apikey:${config.apiKey}`).toString('base64');

  async function requestJson(pathAndQuery: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<Record<string, any>> {
    if (!pathAndQuery.startsWith('/api/v3/') || pathAndQuery.includes('://')) throw new OpError('invalid_config');
    let res: Response;
    try {
      res = await doFetch(origin + pathAndQuery, {
        method, redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
        headers: { Authorization: auth, Accept: 'application/hal+json', ...(body ? { 'Content-Type':'application/json' } : {}) },
        ...(body ? { body:JSON.stringify(body) } : {}),
      });
    } catch (e) {
      // Không đính kèm lỗi gốc: có thể chứa chi tiết request.
      const name = (e as Error)?.name;
      throw new OpError(name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network');
    }
    if (!res.ok) {
      const retry = Number(res.headers.get('retry-after'));
      throw new OpError(kindForStatus(res.status), { status: res.status, retryAfterSeconds: Number.isFinite(retry) && retry > 0 ? retry : undefined });
    }
    let text: string;
    try { text = await res.text(); } catch { throw new OpError('network'); }
    if (!text.trim()) throw new OpError('empty_body', { status: res.status });
    let data: Record<string, any> | null = null;
    try { data = obj(JSON.parse(text)); } catch { data = null; }
    if (!data) throw new OpError('bad_response', { status: res.status });
    return data;
  }
  const getJson = (path:string) => requestJson(path);

  async function getMe(): Promise<{ id: number }> {
    const id = Number((await getJson('/api/v3/users/me')).id);
    if (!Number.isInteger(id) || id <= 0) throw new OpError('bad_response');
    return { id };
  }

  // from/to dạng YYYY-MM-DD, khoảng đóng. Luôn lọc user=me ở server VÀ kiểm lại ở client.
  async function getMyTimeEntries(from: string, to: string): Promise<TimeEntriesResult> {
    if (!DATE.test(from) || !DATE.test(to) || from > to) throw new OpError('invalid_config');
    const me = await getMe();
    const filters = encodeURIComponent(JSON.stringify([
      { user: { operator: '=', values: ['me'] } },
      { spentOn: { operator: '<>d', values: [from, to] } },
    ]));
    const byId = new Map<number, OpTimeEntry>();
    let excludedForeign = 0, pagesFetched = 0, rawSeen = 0, total = Infinity;
    try {
      // offset của OP là SỐ TRANG, bắt đầu từ 1.
      for (let page = 1; page <= maxPages && rawSeen < total; page++) {
        const data = await getJson(`/api/v3/time_entries?pageSize=${pageSize}&offset=${page}&filters=${filters}`);
        const elements = obj(data._embedded)?.elements;
        const t = Number(data.total);
        if (!Array.isArray(elements) || !Number.isInteger(t) || t < 0) throw new OpError('bad_response');
        total = t;
        if (elements.length === 0) { pagesFetched++; break; }
        const pageEntries: OpTimeEntry[] = []; let pageForeign = 0;
        for (const raw of elements) {
          const e = obj(raw); const links = obj(e?._links);
          if (!e || !links) throw new OpError('bad_response');
          if (idFromHref(obj(links.user)?.href) !== me.id) { pageForeign++; continue; }
          const id = Number(e.id); const date = e.spentOn;
          if (!Number.isInteger(id) || typeof date !== 'string' || !DATE.test(date)) throw new OpError('bad_response');
          pageEntries.push({ id, date, hours: parseIsoDuration(e.hours),
            workPackageId: idFromHref(obj(links.workPackage)?.href), projectId: idFromHref(obj(links.project)?.href),
            ...(typeof e.comment?.raw === 'string' ? {note:e.comment.raw} : {}),
            ...(idFromHref(obj(links.activity)?.href) ? {activityId:idFromHref(obj(links.activity)?.href)!} : {}) });
        }
        // Chỉ ghi nhận trang khi cả trang hợp lệ: trang hỏng không để lại dữ liệu nửa vời.
        for (const e of pageEntries) byId.set(e.id, e);
        excludedForeign += pageForeign; rawSeen += elements.length; pagesFetched++;
      }
      if (rawSeen < total) throw new OpError('bad_response'); // trang rỗng/hết giới hạn trang trước khi đủ total
    } catch (e) {
      if (!(e instanceof OpError)) throw e;
      // Trang đầu hỏng = lỗi hẳn; từ trang sau trở đi trả partial để UI không coi là đủ dữ liệu.
      if (pagesFetched === 0) throw e;
      return { status: 'partial', entries: [...byId.values()], excludedForeign, pagesFetched, error: e };
    }
    return { status: 'complete', entries: [...byId.values()], excludedForeign, pagesFetched };
  }

  return { getMe, getMyTimeEntries, requestJson };
}
