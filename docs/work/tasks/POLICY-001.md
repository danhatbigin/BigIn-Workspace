# POLICY-001 — Gói quyết định cho các policy còn Open

Status: Ready cho owner quyết định (không phải task code) | Source MASTER: 0.9 | Owner agent: Claude | 2026-10-12 Asia/Saigon

## Mục đích và ranh giới

Gom các câu hỏi Open trong MASTER mục 9 thành một danh sách owner trả lời được nhanh, kèm đề xuất mặc định và phần code bị chặn. **Đây là đề xuất, không phải quyết định.** Không đổi hành vi prototype; owner trả lời xong thì ghi vào MASTER + change log trước khi code (theo AGENT-SPEC mục 3). Không viết test đóng băng lựa chọn đang Open.

## Câu hỏi cần owner chốt

| ID | Câu hỏi (nguồn) | Đề xuất mặc định (Proposed) | Chặn feature nào |
|---|---|---|---|
| P-01 | Ngày nào thuộc diện phải log: phép, lễ, ngày tương lai, ngày nghỉ khác? Lấy lịch từ đâu? (Q-01, Q-05) | T2–T6, bỏ qua ngày tương lai; phép/lễ nhập tay trong app ở bản pilot cho đến khi có nguồn từ OP/HR | Thiếu kỳ chính xác, reminder |
| P-02 | Thứ Hai chốt lúc nào (giờ/tuần nào)? (Q-01) | Chưa đề xuất; cần thông tin chính sách công ty | Nhắc/cảnh báo deadline |
| P-03 | Biên nhãn giờ 8 / 12 / 16 và trường hợp >16h (LT-01) | <8 thiếu; =8 đủ; >8 đến <12 Well performed; 12–16 Out standing; >16 hiển thị trạng thái “cần xem lại”, không chặn lưu | Recognition/nhãn |
| P-04 | Tập giờ dùng để khen: toàn bộ hay loại trừ nhóm nào (personal/internal/meeting)? (Q-01) | Dùng toàn bộ giờ hợp lệ, không tự loại nhóm nào, kèm giải thích cơ sở | Recognition |
| P-05 | Log trực tiếp vào WP Sprint 12/R65 hay task con; tạo task cần trường nào? (Q-02) | Cho log trực tiếp vào WP bất kỳ user có quyền; trường tạo task tối thiểu theo form OP (xác minh ở OP-AUDIT-001) | Drawer nối OP thật |
| P-06 | Duplicate: bước giờ lẻ và giá trị 0; copy comment/activity; chọn ngày nghỉ/tương lai/khác tháng (Q-03) | Bước 0,25h; giờ >0 và ≤24 (giữ như prototype); không copy comment; cho chọn ngày nghỉ/tương lai với cảnh báo nhẹ | Duplicate nối OP thật |
| P-07 | Vị trí lớp nhập giờ khi duplicate: modal, drawer hay inline (Q-03) | Giữ modal như prototype, chờ owner UAT | UAT UI |
| P-08 | Tuần hiện tại tính tới hôm nay hay cả tuần; tuần giao tháng; timezone; có tính hôm nay trước 17:00; nhắc bù khi máy ngủ; snooze (Q-05, LT-04) | Tính tới hôm nay; tuần giao tháng ghi rõ khoảng ngày; timezone theo máy; nhắc bù khi mở lại nhưng không bắn cuối tuần; chưa có snooze | Reminder nền |
| P-09 | Desktop phát hành trước hay web; máy pilot, RAM, nền tảng (Q-06) | Desktop Windows trước vì đã smoke test | Đóng gói, benchmark |
| P-10 | HeroUI Free hay Pro (DEC-004) | Free; chưa dùng thư viện trong prototype | Thiết kế component |
| P-11 | Có workflow/rule riêng ngoài handoff cần đưa vào master không (Q-07) | — | — |

## Bước tiếp theo

1. Owner trả lời từng P-xx (trả lời “theo đề xuất” cũng được).
2. Agent ghi quyết định vào MASTER (đổi Open → Confirmed, thêm change log 0.10), rồi mở task packet code tương ứng.
3. Việc không bị chặn bởi bảng này: OP-AUDIT-001 (chỉ bị chặn bởi URL/tài khoản test).
