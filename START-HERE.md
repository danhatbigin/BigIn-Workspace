# BigIn Workspace — điểm tiếp nhận công việc

Đọc file này khi bắt đầu hoặc tiếp quản từ agent khác. Không cần lịch sử chat để biết trạng thái đã được ghi lại. Các yêu cầu trực tiếp mới của owner được ưu tiên; ghi lại thay đổi trước khi dựa vào nó để triển khai.

1. Đọc [trạng thái hiện tại](docs/work/CURRENT.md): phase, việc đang dở, bước tiếp theo, bằng chứng và giới hạn.
2. Đọc [quy trình bàn giao](docs/WORKFLOW.md) và [hợp đồng agent](docs/AGENT-SPEC.md).
3. Đọc các mục liên quan trong [master](docs/MASTER.md), [motion spec](docs/MOTION-SPEC.md) và task packet được CURRENT chỉ định. Đọc thêm tài liệu/code khi phụ thuộc yêu cầu; không đọc toàn repo theo thói quen.
4. Kiểm tra checkout, branch, commit và thay đổi chưa commit trước khi sửa. Nếu snapshot khác CURRENT, đối soát diff; không reset hoặc ghi đè để ép khớp tài liệu.
5. Tiếp tục bước cụ thể đã ghi nếu thuộc phạm vi được phép và đủ thông tin. Nếu checkpoint cũ hoặc chưa rõ kết quả thao tác, kiểm chứng trước khi lặp lại.

Owner đã yêu cầu khởi động dự án. Phase hiện tại: implementation nền tảng/local prototype theo task BOOT-001; các product policies còn Open không tự được phê duyệt và OP production chưa được kết nối. START-HERE không tự động được mọi công cụ agent nạp: khi đổi agent, owner cần trỏ agent tới file này. Chưa có hook tự nạp entrypoint.
