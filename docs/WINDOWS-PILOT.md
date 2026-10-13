# Windows pilot 0.2.1 — sử dụng và kiểm thử

Build ở `release/BigIn-Workspace-0.2.1-win-x64.zip`. Giải nén toàn bộ, mở `BigIn Workspace.exe`; giữ các DLL/resources bên cạnh EXE. Không cần Node/npm. Đây là portable internal build chưa ký, không phải installer.

1. Lần đầu nhập API token của chính anh, lấy ở OpenProject → My account → Access tokens → API. Server cố định `https://op.bigin.vn`. Không gửi token qua chat.
2. Connect xác thực tài khoản, lưu token mã hóa trên Windows và tải time entries theo tháng hiện tại. Mở lại app không cần nhập lại; Forget token xóa credential đã lưu.
3. Chuyển Week/Month hoặc kỳ trước/sau để tải range khác. Refresh để đọc lại từ OP. App chỉ đọc entries của tài khoản hiện tại, không trộn demo.
4. Add time → tìm task bằng title hoặc ID → nhập giờ/note → Save time. Thông báo thành công chỉ sau khi API xác nhận. Đây là ghi thật lên OP.
5. Entry menu → Duplicate → chọn ngày → nhập giờ trống mỗi ngày → Duplicate. Ngày trùng task hiện warning cam, không bị chặn. Remove chỉ bỏ draft. Source giữ nguyên.
6. Nếu batch có ngày lỗi, app giữ các ngày chưa xác nhận; retry chỉ gửi ngày failed. Nếu kết quả unknown do mất phản hồi sau POST, dòng bị chặn retry tự động. Kiểm tra OP/Refresh và báo ngày/task cho agent để đối soát; chưa có recovery UI trong pilot. Không xóa journal hoặc đổi nội dung chỉ để né guard.

Search tối đa 100 matches/lần; dùng exact task ID nếu chưa thấy. Activity dùng default project/form của OP hoặc activity nguồn khi duplicate. Nếu project thiếu default/allowed activity, app báo lỗi trước ghi; chưa có activity picker. Project-only entries vẫn tính giờ nhưng không duplicate như work package. Task creation/status editing và reminders chưa bật trong live build.

Giờ đủ/thiếu hiện dùng estimate Mon–Fri, mỗi ngày ≥8, không bù giữa ngày. HR calendar/leave/holiday và recognition labels chưa hoàn thiện. Nếu dữ liệu partial, không hiện kết luận đủ/thiếu như đã tải đủ.

Credential chỉ nằm trong desktop main/userData (safeStorage Windows DPAPI), transient token input bị clear sau connect. Renderer không đọc lại token. Entry write journal được lưu riêng để tránh resend sau restart, có metadata của entry; không đi kèm build. HTTP/IPCs không expose generic fetch/filesystem; token không nằm trong localStorage/release/repo.

Evidence WIN-LIVE-001: 53 unit/domain/API tests, 17 Chromium UI tests, Windows executable integration với local mock server. Kiểm tra token sai/mã hóa/restart/forget, user filter, POST payload/form/default activity, partial retry, uncertain response và renderer isolation. Đây là verification với mock, chưa chứng minh API ghi trên instance BigIn thật; owner UAT sau nhập token mới xác minh instance contract/quyền cụ thể.

Build lại: `npm.cmd run build:windows`. Kiểm tra desktop: `npm.cmd run test:desktop`; môi trường `BIGIN_PACKAGED_EXE` trỏ chính EXE để smoke release với profile riêng và mock localhost. Không dùng token thật trong automated tests. macOS/installers/signing/performance budgets chưa kiểm chứng.
