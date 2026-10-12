# OP-READ-001 — Lớp đọc OpenProject (chỉ GET) và tính thiếu giờ từng ngày

- Status: Verified trong phạm vi đã test (chưa Accepted)
- Owner agent/session: Claude (Sonnet 5.5), theo yêu cầu trực tiếp của owner
- Updated at / timezone: 2026-10-12 12:50 Asia/Saigon
- Source master revision + requirement IDs: MASTER 0.9 — LT-01-R01 (thiếu ngày = max(0, 8 − giờ ngày), không bù); bằng chứng từ [OP-AUDIT-001](OP-AUDIT-001.md)
- Branch / base commit / workspace: main, base 0a3c77c, D:/Projects/BigIn-Workspace
- Dependencies / quyết định cần có: P-01 (ngày thuộc diện tính), P-03 (biên nhãn 8/12/16) còn Open — task này không chốt

## Outcome và scope được duyệt

Adapter TypeScript chạy ở phía main/Node, đọc `/api/v3/users/me` và `/api/v3/time_entries` của chính user, rồi nối vào domain để tính thiếu giờ từng ngày.

Trong scope: xác thực Basic (`apikey` + token); filter `user=me` + `spentOn <>d`; pageSize ≤ 100; offset là số trang từ 1; parse hours ISO; phân loại lỗi; partial; loại entry của người khác; `dailyBreakdown`/`shortfallFromOp`.

Ngoài scope (không làm): ghi/sửa/xóa lên OP (adapter không có phương thức ghi); nhãn 8/12/16; phép/lễ; nối IPC/UI/safeStorage cho Electron; reminder; work package/project. Không đổi stack.

Ranh giới bảo mật: key chỉ vào `createOpClient` ở main/Node. `apps/web` không import `packages/op` (có test). Lỗi dùng message cố định, không chứa key/body/URL. Không log.

## Acceptance criteria / evidence mapping

| AC | Implementation | Cách kiểm tra | Kết quả | Code state |
|---|---|---|---|---|
| AC1 Chỉ GET, luôn lọc user=me + spentOn, pageSize ≤ 100, offset số trang từ 1 | packages/op/client.ts | op.test.ts "chỉ GET…", "pageSize quá 100 bị kẹp" | PASS | working tree trên 0a3c77c |
| AC2 Parse ISO duration (PT8H, PT15M, PT1H30M…), từ chối định dạng mơ hồ | packages/op/duration.ts | op.test.ts parseIsoDuration | PASS | nt |
| AC3 Phân trang nhiều trang; trùng id giữa trang chỉ tính một lần | client.ts | "đi hết các trang" (16 entry/4 trang), "trùng id" | PASS | nt |
| AC4 Entry của người khác lẫn vào bị loại và đếm | client.ts | "entry của người khác lẫn vào" | PASS | nt |
| AC5 Phân loại lỗi 401/403/404/429(+retry-after)/5xx/mã khác/body rỗng/không phải JSON/mất mạng/timeout | packages/op/errors.ts, client.ts | op.test.ts 13 ca | PASS | nt |
| AC6 Key không xuất hiện trong message, stack, JSON, String(error), URL, console; không có trong dist/ và repo | client.ts, errors.ts | op.test.ts + grep dist/repo | PASS | nt |
| AC7 Partial: trang sau lỗi hoặc thiếu so với total → status partial, reliable=false; lỗi ngay trang đầu thì ném lỗi; entry hỏng không bị bỏ qua thầm lặng | client.ts | op.test.ts mục partial | PASS | nt |
| AC8 Tháng 10 của owner (01=12, 02=16, 05=13, 06–09=14; 97h/16 entry); ngày chưa log; không bù | packages/op/shortfall.ts, packages/domain/time.ts (`dailyBreakdown`) | op.test.ts "tháng 10", "ngày chưa log", "6h vẫn thiếu 2h" | PASS | nt |
| AC9 Renderer không giữ key; lớp op không lộ phương thức ghi | op.test.ts "ranh giới" | | PASS | nt |
| AC10 Đọc thật chỉ-GET khớp fixture | scripts/op-read-live.ts | chạy với key owner qua biến môi trường | PASS (xem dưới) | nt |

Fixture: tự soạn, ẩn danh, ngay trong `packages/op/op.test.ts` (id số giả, không tên/email/comment, key giả `fake-test-key-0000`). Không có dữ liệu thật trong repo.

## Evidence (Windows, Node 24.16.0, chạy bằng cmd)

| Lệnh | Thời điểm | Kết quả |
|---|---|---|
| `npm run check` (typecheck, vitest 41/41 gồm 34 test mới, docs:check) | 2026-10-12 12:48 | PASS |
| `npm run build` | 12:49 | PASS |
| `npm run test:e2e` | 12:49 | PASS 8/8 |
| `npm run test:desktop` | 12:49 | PASS (win32) |
| `tsx scripts/op-read-live.ts 2026-10-01 2026-10-31 2026-10-12` (GET thật, tài khoản owner) | 12:48 | status=complete, 16 entry, 1 trang, 0 entry người khác, 97h; 01=12, 02=16, 05=13, 06–09=14; thiếu duy nhất 12/10 = 8h (hôm nay, chưa log) |

Chạy thật chỉ gọi GET `/users/me` và `/time_entries`. Không gọi endpoint ghi. Lịch T2–T6 trong lần chạy thật chỉ là đầu vào minh hoạ, không phải policy P-01.

## Checkpoint

- Đã hoàn thành: adapter, nối domain, test, đọc thật.
- Chưa làm / giới hạn: nối IPC main↔renderer và lưu key bằng safeStorage (chưa có task); phân trang nhiều trang chưa thử trên OP thật (tháng 10 chỉ 1 trang) — đã test bằng server giả; 429 chưa gặp trên OP thật; chưa kiểm thử Mac.
- Bước kế tiếp: owner trả lời P-01/P-03; task riêng cho IPC + safeStorage + UI hiển thị thiếu giờ.
- Hướng đã thử: không có.
- Thay đổi chưa commit: file `scripts/op-write-test.mjs` (của owner, untracked) giữ nguyên, không đụng.

## Hoàn tất / bàn giao

Verified trong phạm vi test ở trên. Chưa Accepted. Chưa gắn nhãn 8/12/16.
