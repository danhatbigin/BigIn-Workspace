# OP-AUDIT-001 — Audit khả năng và auth của OpenProject

Status: In progress — chỉ đọc; chờ owner dán thêm kết quả/tài khoản test | Source MASTER: 0.9 (DEC-006, Q-04, mục 11) | Owner agent: Claude | 2026-10-12 Asia/Saigon

## Outcome

Biết chắc OP instance của BigIn hỗ trợ gì trước khi viết adapter: xác thực, CORS, quyền, time entries, work packages, tạo task, ghi nhiều entry (partial success/idempotency). Kết quả là báo cáo evidence + khuyến nghị kiến trúc (desktop direct OP, static web direct nếu auth/CORS cho phép, BFF chỉ khi có lý do). **Không port UI và không ghi dữ liệu production.**

## Blocker — cần owner cung cấp

1. Base URL của OP: **https://op.bigin.vn/** (owner cung cấp 2026-10-12). Version vẫn chưa biết. Không paste API key vào tài liệu/chat/repo.
2. Cách có tài khoản test: ưu tiên project/user thử nghiệm; nếu chỉ có tài khoản thật thì audit read-only và owner xác nhận bằng văn bản trước khi thử bất kỳ thao tác ghi nào.
3. Quyền reuse và truy cập repo cũ của anh Tâm (MASTER: chỉ khai thác phần giao tiếp OP; cần audit source và quyền reuse trước khi copy). Hiện chưa đọc repo này.
4. Cơ chế giữ credential mong muốn (đề xuất: safeStorage của OS ở desktop; chưa chốt cho web).

## Checklist audit (mọi mục NOT RUN)

| # | Cần xác minh | Cách kiểm tra | Kết quả |
|---|---|---|---|
| 1 | Version OP và API v3 bật | GET /api/v3 (root); owner mở trong trình duyệt đã đăng nhập và dán JSON | PARTIAL PASS 2026-10-12: API v3 bật, instanceName=BigIn, root có link user (phiên đã xác thực), configuration, memberships, priorities, relations, statuses, time_entries, types, userPreferences, workPackages. Không thấy coreVersion trong response (version vẫn chưa biết). Root không có link projects; chưa kết luận lý do (quyền hay version) |
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

## Nguồn tham chiếu: repo anh Tâm (đọc 2026-10-12)

Repo: https://github.com/tammai/op-time-tracker-tauri (Tauri 2 + Rust, Vue 3). Bản Electron cũ: tammai/op-time-tracker (chưa đọc). Đã clone shallow, chỉ đọc, vào D:\Projects\op-time-tracker-tauri (ngoài repo này). Đây là **tài liệu về cách app của anh Tâm gọi OP, chưa phải bằng chứng trên instance** cho tới khi ta chạy lại; mục nào dưới đây ghi "theo repo" thì vẫn NOT RUN ở phía ta.

**Quyền reuse — blocker pháp lý/quy trình:** repo không có file LICENSE. Mặc định không có quyền copy code. Chỉ dùng như tài liệu tham khảo cho tới khi anh Tâm xác nhận bằng văn bản (hoặc thêm license). Không copy file nào vào BigIn-Workspace trước đó.

**Theo repo (cần xác minh lại):**

| Chủ đề | Nội dung theo repo | Liên quan mục |
|---|---|---|
| Auth | HTTP Basic với user `apikey` + API token OP (avatar → My account → Access tokens → API). README ghi ví dụ chính `https://op.bigin.vn`, nghĩa là cơ chế này đã chạy với instance BigIn | #2 |
| Giữ key | OS keychain (crate keyring: Credential Manager/DPAPI, Keychain); URL gốc lưu JSON riêng; webview không bao giờ thấy key; mọi HTTP làm ở backend Rust | #2, MASTER §11 |
| CORS | App desktop gọi từ backend Rust nên không dính CORS; không có bằng chứng cho web trực tiếp | #3 |
| Endpoint dùng | GET /api/v3, /users/me, /time_entries, /work_packages, /statuses, /work_packages/available_projects, /projects/{id}/available_assignees, /work_packages/{id}/attachments, /attachments/{id}[/content]; POST /time_entries, /time_entries/form, /work_packages, /work_packages/{id}/form, /projects/{id}/work_packages/form; PATCH /time_entries/{id}, /work_packages/{id}; DELETE /time_entries/{id}, /attachments/{id} | #4–#9 |
| Lọc time entries | filters JSON: spentOn `<>d` (khoảng đóng) hoặc `=d` (một ngày), user `=` ["me"], workPackage `=` [id dạng chuỗi]; phân trang pageSize (kẹp ≤200)/offset; calendar lấy mọi trang | #6 |
| Tìm work package | filter subjectOrId toán tử `**`; assignee `=` me; status `o` (open) hoặc `=` theo id (không dùng tên: 400); mặc định sort id asc nên nên sortBy updatedAt desc | #5 |
| Tạo/sửa time entry | Body: spentOn, hours là ISO 8601 duration (vd PT1H30M), _links.workPackage + _links.activity (bắt buộc), comment.raw tùy chọn. PATCH là full replacement (bỏ comment = xóa comment). Activity phụ thuộc project của WP, lấy từ POST /time_entries/form (_embedded.schema.activity.allowedValues, fallback _links) | #7 |
| Tạo work package | Form riêng theo project/type; `format` của description ghim markdown; không dùng html server trả về | #8 |
| Batch/idempotency | Repo không dùng batch; mỗi thao tác là một request. Không có bằng chứng OP hỗ trợ transaction | #10 |
| Lỗi cần xử lý | 401/403 auth; 404; 409 conflict (lockVersion); 422 validation; body 2xx rỗng (proxy) thành lỗi riêng; mất kết nối | #10 |
| Giới hạn | Đính kèm 5 MB mặc định theo instance; repo giới hạn trần 64 MB phía client | #11 |
| Fixture | tests/fixtures/*.json là response thật chụp từ một instance; có thể chứa dữ liệu công ty, không copy | — |

**Hệ quả cho thiết kế (Proposed, chờ owner):** hướng desktop direct OP bằng API key là khả thi theo bằng chứng từ repo; credential nên nằm ở lớp main/backend của Electron (safeStorage) chứ không vào renderer. Rule 8h/ngày và lịch ngày của anh Tâm (xanh đúng 8h, đỏ >8h, cap 8 cho entry mới) là cách khác với MASTER của owner (không bù, 8/12/16, duplicate); không import rule từ đó.

**Còn thiếu để xác minh trên instance (cần owner):** chạy lại các GET chỉ đọc bằng phiên/API key của owner (configuration, users/me, time_entries một trang, time_entries/form với một WP test), hoặc nhận fixture sạch từ anh Tâm.

## Làm được ngay khi chưa có blocker

- Thiết kế interface adapter OP (read-only trước) ở `packages/` theo kiến trúc đề xuất ở MASTER mục 11, dùng mock; chưa làm cho tới khi owner đồng ý mở rộng scope.
- Không có việc nào khác độc lập; không tự dựng server OP giả để suy kết luận về instance thật.

## Checkpoint

- Đã hoàn thành: soạn packet và checklist.
- Mục 1 đã có evidence một phần (xem bảng). Bước kế tiếp: owner dán GET /api/v3/configuration, /api/v3/users/me, /api/v3/time_entries?pageSize=1; mục 2-3 (auth, CORS) cần tài khoản test/admin; sau đó chạy checklist read-only trước, ghi evidence vào packet này.
- Không có thao tác ngoài repo đang chạy.
