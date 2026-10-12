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

## Bổ sung 2026-10-12 từ dữ liệu OP thật của owner (xem OP-AUDIT-001)

- P-03: có ngày đúng 12h (01/10) và đúng 16h (02/10) trong tháng 10, nên cần quyết biên **bao gồm hay không bao gồm** 12 và 16 (đề xuất hiện tại: 12–16 là Out standing, tức 12 và 16 thuộc Out standing).
- P-01: OP có work package "Personal Time" theo tháng và work package nghỉ phép dạng "off N day(s)"; có thể là nguồn dữ liệu phép nhưng cần HR/admin xác nhận trước khi dùng.
- P-06: OP không giới hạn giờ mỗi entry; mức trần 24h/entry của prototype và cap 8h của app anh Tâm đều là rule phía app, không phải của OP.
- P-05: schema cho phép ghi giờ vào project không cần work package; owner cần quyết có hỗ trợ không (khác với luồng hiện tại bắt chọn/tạo task).

## Trả lời của owner 2026-10-12

- **P-01: Confirmed — phương án A** (T2–T6, bỏ ngày tương lai, phép/lễ nhập tay ở bản pilot). Chưa có code cho phần nhập phép/lễ.
- **P-03: owner giao agent đặt tên nhãn (chỉ copy).** Biên inclusive/exclusive của 12 và 16 vẫn Open. Tên đề xuất (Proposed, owner có thể đổi):

| Khoảng giờ/ngày | Tên nhãn đề xuất (VI) | Ghi chú |
|---|---|---|
| < 8 | Còn thiếu X giờ | Không phải "khen"; nêu số giờ thiếu |
| = 8 | Đủ giờ | |
| > 8 đến < 12 | Well performed | Tên owner đã đặt |
| 12 đến 16 | Out standing | Tên owner đã đặt (biên còn Open) |
| > 16 | Cần xem lại | Không chặn lưu, không khen |

- Task nối UI/Electron: owner muốn polish UI/UX trước; chưa mở.

## Cập nhật: ngôn ngữ UI = English (owner, 2026-10-12)

Nhãn đề xuất cho UI (English): < 8 → "X h missing"; = 8 → "Complete"; > 8 đến < 12 → "Well performed"; 12–16 → "Out standing"; > 16 → "Needs review". Bảng tiếng Việt phía trên chỉ để đọc nội bộ. Biên 12/16 vẫn Open.
