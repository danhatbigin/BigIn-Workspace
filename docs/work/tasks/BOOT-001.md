# BOOT-001 — Local foundation và luồng time logging

Status: Verified trong phạm vi local prototype; chờ owner UAT | Source MASTER: 0.9 | Owner: Codex | 2026-10-12 Asia/Saigon

## Authorization và scope

Owner yêu cầu “Khởi động dự án đi em”. Đã triển khai nền React/TypeScript/Vite + Electron; lịch tuần/tháng; drawer tìm/tạo task local và log; duplicate entry; motion config + Reduce Motion; persistence local; tests và handoff.

Không có OP credentials/API, production writes, background reminders thật, signed installers, macOS QA hoặc reward thresholds. HeroUI chưa chọn tier: dùng semantic primitives/CSS, không mua thư viện. Motion được dùng làm implementation default theo tư vấn trước.

## Defaults chỉ cho demo

- T2–T6 đến hôm nay, chưa gồm phép/lễ. Ngày mẫu được sinh theo ngày local của máy khi chưa có dữ liệu.
- Giờ nhập >0 và <=24 mỗi entry, số thập phân; duplicate giữ note, target hours do người dùng nhập.
- Source data localStorage `bigin-demo-v1`; không sync giữa browser/Electron. Lưu thất bại giữ draft và báo lỗi.
- Đóng Electron hiện thoát app; chưa có reminder background.

## Evidence — 2026-10-12, khoảng 11:51–11:57 Asia/Saigon

| Phần | Command / evidence | Kết quả |
|---|---|---|
| TypeScript | npm run typecheck / npm run check | PASS |
| Daily rules, duplicate, calendar, persistence validation | npm test | 7/7 PASS |
| Browser workflow | npm run test:e2e, Chromium | 8/8 PASS |
| Production renderer | npm run build | PASS; JS 388.89 kB / gzip 122.81 kB, CSS 21.71 kB / gzip 5.60 kB |
| Motion docs/config consistency | npm run docs:check | PASS |
| Electron Windows | npm run test:desktop | PASS production UI boot, drawer, sandbox/contextIsolation/no Node in renderer |
| Visual review | test-results/workspace-preview.png, duplicate-preview.png | Đã xem; desktop calendar và dialog không bị overlap/cắt chữ nghiêm trọng |
| macOS / installers / live OP / OS reminders / performance budget | Chưa chạy | NOT RUN |

Asset size không phải RAM runtime; chưa có benchmark tổng bộ nhớ. Test không chứng minh mọi accessibility/platform behavior đã pass.

## AC được kiểm chứng

- LT-01-R01: 6/10/8/8/8 = 40h nhưng vẫn thiếu 2h một ngày.
- LT-03-R01: ô giờ trống bắt buộc, không prefill; lưu hours riêng từng target.
- LT-03-R02: Remove draft không chạm source; bỏ hết vô hiệu submit; Cancel không ghi.
- LT-03-R03: cùng task tại target hiện warning cam nhưng vẫn tạo entry mới; source giữ nguyên.
- Back từ form về chọn ngày giữ các giờ còn lại; remove rồi chọn lại một ngày bắt đầu trống.
- Lưu local failure giữ input, không toast thành công.
- OS Reduced Motion đổi trong khi app mở cập nhật ngay; viewport 390px không horizontal overflow trong test.
- Drawer chọn/tạo task và log không cần copy ID; persistence sau reload.

## Vấn đề đã xử lý

- Motion hook ban đầu không cập nhật preference OS khi chạy test đổi động: dùng useSyncExternalStore với matchMedia change, policy chung cho Motion và CSS.
- Bản nháp giờ khi quay lại chọn ngày đã được giữ trong state theo date; không prefill nguồn.
- Lượt test sandbox đầu không truy cập server đúng; dừng lượt đó rồi chạy local server/browser với permission thích hợp. Electron binary đã tải, không cần xóa dependencies.

## Code và checkpoint

- Domain: packages/domain/time.ts, demo.ts, time.test.ts.
- UI: apps/web/src/App.tsx, Drawer.tsx, DuplicateDialog.tsx, Dialog.tsx, styles.css.
- State: useWorkspace.ts; OS preference: useMotionPreference.ts.
- Motion source: packages/ui/src/motion/motion.config.ts; bảng docs được generate.
- Desktop: apps/desktop/main.cjs. Test smoke tạo profile temp riêng, cửa sổ ẩn, không dùng dữ liệu user.
- Repo main chưa có commit; mọi source/docs đang untracked. Chưa push/deploy/PR.

## Bước tiếp theo

1. Owner trải nghiệm local preview, phản hồi layout và luồng; ghi thay đổi vào master + packet.
2. Chuẩn bị task OP capability/auth audit; cần endpoint/version và cơ chế tài khoản test phù hợp. Không yêu cầu paste production key vào tài liệu.
3. Chốt lịch phép/lễ, các biên reward và missed reminder trước feature tương ứng.
4. Đóng gói và kiểm tra từng platform sau khi nền tích hợp ổn định; không đánh dấu Accepted trước UAT.
