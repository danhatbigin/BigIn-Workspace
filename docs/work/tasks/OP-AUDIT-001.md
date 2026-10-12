# OP-AUDIT-001 — Audit khả năng và auth của OpenProject

Status: Blocked (thiếu input từ owner) | Source MASTER: 0.9 (DEC-006, Q-04, mục 11) | Owner agent: Claude | 2026-10-12 Asia/Saigon

## Outcome

Biết chắc OP instance của BigIn hỗ trợ gì trước khi viết adapter: xác thực, CORS, quyền, time entries, work packages, tạo task, ghi nhiều entry (partial success/idempotency). Kết quả là báo cáo evidence + khuyến nghị kiến trúc (desktop direct OP, static web direct nếu auth/CORS cho phép, BFF chỉ khi có lý do). **Không port UI và không ghi dữ liệu production.**

## Blocker — cần owner cung cấp

1. Base URL của OP và version (không paste API key vào tài liệu/chat/repo).
2. Cách có tài khoản test: ưu tiên project/user thử nghiệm; nếu chỉ có tài khoản thật thì audit read-only và owner xác nhận bằng văn bản trước khi thử bất kỳ thao tác ghi nào.
3. Quyền reuse và truy cập repo cũ của anh Tâm (MASTER: chỉ khai thác phần giao tiếp OP; cần audit source và quyền reuse trước khi copy). Hiện chưa đọc repo này.
4. Cơ chế giữ credential mong muốn (đề xuất: safeStorage của OS ở desktop; chưa chốt cho web).

## Checklist audit (mọi mục NOT RUN)

| # | Cần xác minh | Cách kiểm tra | Kết quả |
|---|---|---|---|
| 1 | Version OP và API v3 bật | GET /api/v3 (root) | NOT RUN |
| 2 | Cơ chế auth khả dụng: API key (basic), OAuth2 authorization code + PKCE cho public client, session | Hỏi admin + thử trên instance; không mặc định OAuth/PKCE hỗ trợ | NOT RUN |
| 3 | CORS cho origin web và Electron | Gọi từ origin thử, đọc header; xem cấu hình admin API/CORS | NOT RUN |
| 4 | Quyền người dùng hiện tại: log time ở project/WP nào | GET /api/v3/users/me, form/_links của work package/time entry | NOT RUN |
| 5 | Tìm/lọc work package theo project, tên; phân trang | GET /api/v3/work_packages?filters=…; xác minh quan hệ Sprint 12/R65 không giả định phân cấp | NOT RUN |
| 6 | Đọc time entries của user theo khoảng ngày (spentOn) để tính thiếu giờ và phát hiện trùng task | GET /api/v3/time_entries?filters=… | NOT RUN |
| 7 | Contract tạo time entry: trường bắt buộc, kiểu giờ (ISO duration), activity bắt buộc không, validation form | POST /time_entries/form trước khi POST thật (dùng tài khoản test) | NOT RUN |
| 8 | Tạo work package: trường bắt buộc, type/status/assignee | POST /work_packages/form | NOT RUN |
| 9 | Đổi status work package độc lập với log | Form của WP | NOT RUN |
| 10 | Batch/atomic và idempotency: nhiều POST tuần tự, mất response sau ghi, đối soát trước retry | Thiết kế test trên project thử nghiệm; không giả định transaction | NOT RUN |
| 11 | Giới hạn tốc độ/lỗi/phân trang cho reminder nền | Đọc header phản hồi, tài liệu admin | NOT RUN |
| 12 | Lịch phép/lễ có lấy được từ OP hay HR không | Hỏi owner/admin; gắn P-01 | NOT RUN |

Các endpoint ở cột “Cách kiểm tra” là gợi ý từ tài liệu công khai của OpenProject API v3, **chưa xác minh trên instance BigIn**; mỗi mục phải có evidence (lệnh, thời điểm, PASS/FAIL) khi chạy.

## Làm được ngay khi chưa có blocker

- Thiết kế interface adapter OP (read-only trước) ở `packages/` theo kiến trúc đề xuất ở MASTER mục 11, dùng mock; chưa làm cho tới khi owner đồng ý mở rộng scope.
- Không có việc nào khác độc lập; không tự dựng server OP giả để suy kết luận về instance thật.

## Checkpoint

- Đã hoàn thành: soạn packet và checklist.
- Bước kế tiếp: chờ owner cấp URL/tài khoản test; sau đó chạy checklist read-only trước, ghi evidence vào packet này.
- Không có thao tác ngoài repo đang chạy.
