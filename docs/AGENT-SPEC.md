# Agent specification — quy trình đề xuất

Revision: 0.9 | Source: MASTER.md revision 0.9 | Trạng thái: implementation nền tảng/local prototype

Owner đã cho khởi động dự án. Task BOOT-001 triển khai local prototype dựa trên rules đủ rõ; không tự phê duyệt policies còn Open hoặc truy cập dữ liệu OP thật.

## 1. Một nguồn yêu cầu

Entry point tiếp quản: [START-HERE](../START-HERE.md). Trước tiếp tục đọc [CURRENT](work/CURRENT.md), packet được chỉ định và [WORKFLOW](WORKFLOW.md); đối soát branch/commit/diff. Cập nhật checkpoint sau mỗi mốc sửa/kiểm tra. Không chờ hết context. Template packet ở [TASK-TEMPLATE](work/TASK-TEMPLATE.md). Chưa có automation tự enforce.

MASTER.md là nguồn chuẩn cho hành vi sản phẩm. Tài liệu kỹ thuật tham chiếu requirement ID, không sao chép thành một bộ business rules độc lập. Input mới của owner được ghi vào master trước khi phát hành work packet cập nhật. Nếu thấy mâu thuẫn, đánh dấu và giải quyết, không tự chọn im lặng.

Không hứa “đồng bộ tuyệt đối” chỉ bằng prompt. Cần kết hợp truy vết yêu cầu, kiểm tra revision và review ngữ nghĩa. Chưa có automation enforce trong repo này.

## 2. Work packet theo feature

Mỗi packet gồm:

1. Source revision/content hash; feature ID và requirement ID.
2. Outcome, phạm vi được duyệt, phần chưa được duyệt.
3. Rule/acceptance criteria liên quan; link tới nội dung master.
4. UX states, interaction, visual/motion constraints.
5. API contract, permissions và bằng chứng đã xác minh.
6. Files/modules liên quan, phụ thuộc và test cần chạy.
7. Câu hỏi còn mở, blocker và giới hạn được chấp nhận.

Chỉ đưa ngữ cảnh cần thiết để agent tiết kiệm thời gian và token; không bỏ điều kiện quyền, lỗi, concurrency hoặc acceptance criteria để rút ngắn packet.

## 3. Chu trình đồng bộ

Owner bổ sung → cập nhật master và change log → xác định requirement bị ảnh hưởng → đánh dấu packet liên quan cần cập nhật → cập nhật packet và test → triển khai → đối chiếu acceptance criteria/UX → owner UAT.

Đề xuất gate sau khi có tooling: revision/hash không khớp thì cần rà soát tác động trước khi coi packet là current; requirement không có AC hoặc AC không có evidence thì không đánh dấu Verified. Hash kiểm tra độ mới, không chứng minh code đúng nghĩa.

Mỗi thay đổi cần bảng truy vết: requirement → implementation → test/evidence → trạng thái. Đề xuất trạng thái: Draft, Ready, Implemented, Verified, Accepted. Việc agent viết xong không tương đương owner chấp nhận.

## 4. Các ranh giới hiện tại

- Motion theo [MOTION-SPEC.md](MOTION-SPEC.md): registry tập trung và Reduce Motion đã được owner chốt; engine Motion + CSS/thông số vẫn Proposed. Khi build dùng một config tokens/presets/usages, docs sinh/đối chiếu từ config; không hardcode duration/easing tại feature. Một element/property chỉ một engine owner. Reduce Motion áp cả CSS/HeroUI/chart, không chỉ MotionConfig. Layout feature cần bundle phù hợp. Không tự xem registry proposal là code đã triển khai.

- React/Electron đã được owner xác nhận; không tự đổi stack.
- BFF chưa được xác nhận; owner đang yêu cầu tư vấn tối ưu hạ tầng, không coi “web không server” là quyết định kiến trúc bất biến. Tham chiếu master mục 11.
- Chỉ khai thác integration OP từ repo cũ; không port UI. Audit source và quyền reuse trước khi copy.
- Không ép Project → Sprint → Task; WP tên Sprint 12/R65 chưa chứng minh quan hệ phân cấp hoặc quyền public.
- LT-01-R01: Mỗi ngày cần log phải >=8 giờ, không bù. Thiếu kỳ là tổng max(0,8−giờ ngày) cho các ngày đủ điều kiện; không lấy max(0,target kỳ−tổng giờ). Biên nhãn 8/12/16, trên 16, lịch nghỉ và deadline thứ Hai còn Open.
- Nhu cầu khích lệ nỗ lực đã xác nhận; không tự thay bằng completeness đơn thuần. Tách completeness/recognition hiện là đề xuất. Không suy diễn personal ticket là thời gian không hợp lệ; tập giờ tính reward và biên ngưỡng còn Open. Không tự suy ra năng suất từ giờ log.
- Lời nhắc personal chuyên biệt bỏ khỏi MVP theo điều kiện owner; không xây mapping ticket HR từng tháng, đoán tên/AI hoặc thêm lời nhắc mọi ticket để thay thế. Điều này không tự chốt tập giờ tính reward.
- Duplicate một entry từ ba chấm → mode chọn ngày → lớp nhập số giờ bắt buộc riêng từng ngày → xác nhận. LT-03-R01: ô giờ ban đầu trống có chủ đích reflection, không prefill giờ nguồn. LT-03-R02: Remove từng draft đích không xóa record OP. LT-03-R03: cùng task đã có log ở ngày đích thì dòng draft màu cam kèm warning, vẫn thao tác và tạo thêm bình thường, không gộp/ghi đè hoặc thêm confirmation gate. Không ghi OP ở bước chỉ chọn ngày; không bỏ lớp nhập giờ; không tự thêm Ctrl + drag. Quy tắc số còn Open.
- Reminder 17:00 working day, không thứ Bảy/Chủ nhật; phạm vi tháng hiện tại, summary theo tuần trong một noti; đóng cửa sổ giữ nền cho reminder only. Tuần hiện tại/giao tháng, lịch nghỉ và missed reminder còn mở. Không hardcode mọi tuần target 40; không mặc định 40/40 nghĩa là từng ngày đủ. Không cam kết parity chạy nền với web khi đóng tab.
- Không mặc định OP hỗ trợ ghi batch nguyên tử; cần thiết kế partial success và retry sau khi xác minh contract.
- Không thay animation bằng delay chặn nhập liệu. Hiệu năng cần evidence trên production build và nền tảng tương ứng.
- Không lưu credentials vào tài liệu/test fixtures. Auth và nơi giữ credentials phải được giải quyết trước tích hợp thật.

## 5. Kế hoạch kiểm chứng dự kiến

Acceptance LT-03-R03: ngày đích có log cùng task hiện warning chữ và màu cam tại đúng dòng; vẫn sửa giờ, Remove và submit được nếu các validation khác hợp lệ; submit tạo entry mới và giữ nguyên entry cũ. Warning không cho phép bỏ trống giờ. Chi tiết matching current user + work package ID + spentOn là đề xuất trong master, cần xác minh contract trước triển khai. Không nhầm duplicate có chủ đích với entry trùng do retry request mất phản hồi.

Ưu tiên luồng tìm/tạo task → log; duplicate có ngày thành công/ngày lỗi; mất response sau ghi; ngày/tuần/tháng cập nhật; notification theo vòng đời app; dữ liệu target và quyền hạn.

Kiểm tra visual bằng trạng thái thực tế: loading, empty, denied, error, draft, saving, confirmed, partial success. Evidence local prototype BOOT-001 gồm domain tests, Chromium E2E và Electron Windows smoke. Chưa có OP integration/partial success runtime, CI hoặc performance budget benchmark; không suy rộng evidence local thành production verification.

Khi rules được duyệt, thêm kiểm chứng biên đúng 8/12/16 và trên 16; Cancel duplicate không tạo mutation; ngày đã chọn không mở day detail; notification không gửi cuối tuần kể cả catch-up; nhóm nhiều ngày thiếu thành một noti; đóng cửa sổ không còn chạy UI nền. Không viết test đóng băng lựa chọn đang Open.

Acceptance LT-03 có thể chuẩn bị: một entry nguồn, N ngày đích và N ô giờ; một ô trống chặn toàn bộ submit trước ghi và giữ input; giờ ngày đích đúng theo từng ô; source không đổi; partial success chỉ retry phần chưa được xác nhận sau đối soát. Notification cần case tuần giao tháng/tuần chưa kết thúc theo policy được duyệt. Recognition cần đối chiếu dữ liệu thật, không lặp reward khi refresh và không bị trạng thái thiếu giờ che mất; chỉ triển khai khi đề xuất liên quan được duyệt.

Acceptance 0.5: 6/10/8/8/8 giờ vẫn thiếu 2 giờ một ngày dù tổng 40; noti LT-04-R01 không bị triệt tiêu bởi tổng đó. Duplicate ban đầu không prefill; Remove dòng trống loại validation/payload của dòng đó, giữ input dòng khác và không gọi DELETE; không submit khi không còn đích. Chọn lại ngày đã remove bắt đầu trống theo chi tiết UX đề xuất. Các case local đã có evidence BOOT-001; noti và lịch nghỉ chưa implement.
