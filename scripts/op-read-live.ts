// Đọc THẬT, CHỈ GET: giờ của chính mình theo từng ngày. Key lấy từ biến môi trường OP_API_KEY, không in, không lưu.
// Chỉ in số liệu tổng hợp (ngày, giờ), không in tên/comment/ID. Dùng: tsx scripts/op-read-live.ts 2026-10-01 2026-10-31 [YYYY-MM-DD hôm nay]
import { createOpClient } from '../packages/op/client';
import { OpError } from '../packages/op/errors';
import { shortfallFromOp } from '../packages/op/shortfall';
import { addDays, isWorkingDay } from '../packages/domain/time';

const [from, to, today = to] = process.argv.slice(2);
try {
  const client = createOpClient({ baseUrl: process.env.OP_BASE_URL ?? 'https://op.bigin.vn', apiKey: process.env.OP_API_KEY ?? '' });
  const result = await client.getMyTimeEntries(from, to);
  const dates: string[] = [];
  for (let d = from; d <= today; d = addDays(d, 1)) if (isWorkingDay(d)) dates.push(d); // đầu vào minh hoạ, không phải policy P-01
  const s = shortfallFromOp(result, dates);
  console.log(`status=${result.status} entries=${result.entries.length} pages=${result.pagesFetched} foreignExcluded=${result.excludedForeign} logged=${s.loggedTotal}h missing=${s.missingTotal}h`);
  const logged = new Map<string, number>();
  for (const e of result.entries) logged.set(e.date, (logged.get(e.date) ?? 0) + e.hours);
  for (const [date, hours] of [...logged].sort()) console.log(`${date} ${hours}h`);
  for (const d of s.days.filter(d => d.missing > 0)) console.log(`THIẾU ${d.date}: ${d.missing}h`);
} catch (e) {
  console.error(e instanceof OpError ? `LỖI ${e.kind}${e.status ? ' ' + e.status : ''}: ${e.message}` : 'LỖI không xác định');
  process.exitCode = 1;
}
