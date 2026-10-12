# Product master

Revision: 0.11 | 2026-10-12 | Implementation nền tảng/local prototype; PRD chi tiết tiếp tục discovery

## 1. Vấn đề và kết quả mong muốn

**Confirmed:** Owner là người dùng pilot đầu tiên. Hiện tại anh phải vào OP công ty để tìm task, tạo nếu chưa có, copy task ID sang app của anh Tâm rồi log từng ngày. Việc chuyển ngữ cảnh và nhập lặp gây stress, khiến anh ngại log time.

MVP phải giúp anh biết tuần/tháng đã log đủ chưa, xử lý phần thiếu ngay trong workspace và được nhắc qua notification của OS. Owner đã chọn duplicate một entry từ menu ba chấm, chọn nhiều ngày, sau đó nhập giờ bắt buộc cho từng ngày trước khi lưu.

**Confirmed — nhu cầu cảm xúc:** Owner muốn được ghi nhận nỗ lực khi dành nhiều thời gian cho công việc, kể cả khi không được trả OT; muốn nhìn lại tuần và thấy thành quả/nỗ lực hiện diện. Ví dụ tự thuật: ở VirgilHR anh phân tích requirement, hướng dẫn cấp dưới, kiểm tra và họp client; ở MiVida anh phụ trách Website + CMS, Flutter mobile và Portal patient + Medical team. Cảm giác khó chịu xuất hiện khi log vẫn đỏ hoặc khi hoàn tất mà không có phản hồi khích lệ. Đây là lời kể của owner, không phải dữ liệu OP đã kiểm chứng hoặc bằng chứng hiệu suất.

Owner cũng nêu ví dụ 6 giờ công việc + 2 giờ personal ticket vẫn xanh đủ 8, nhưng không nên có cùng ý nghĩa khen thưởng với nỗ lực dành cho project. **Confirmed:** Personal ticket do HR cung cấp mỗi tháng và không yêu cầu phân loại employee làm gì. Owner muốn lời nhắc nhẹ để tự nhìn lại thời gian personal, nhưng cho phép bỏ nếu cần xác định ticket ID/task. Quyết định discovery: bỏ lời nhắc chuyên biệt này khỏi MVP vì hiện chưa có cách nhận diện đáng tin cậy mà không cần mapping; không yêu cầu owner cấu hình ID hàng tháng, không đoán từ tên hoặc dùng AI suy diễn. Không thay bằng lời nhắc chung cho mọi ticket khi owner chưa yêu cầu. Không mặc định personal time là không hợp lệ; tập giờ dùng tính reward vẫn chưa được chốt.

**Proposed:** Đánh giá pilot bằng thời gian hoàn thành luồng log, số lần phải quay về OP/copy ID, số lỗi hoặc log trùng, và cảm nhận ngại/stress trước–sau của owner. Đo baseline trước khi đặt mục tiêu định lượng. Không suy rộng tâm lý của owner thành kết luận cho mọi nhân viên.

## 2. Quyết định và ranh giới

| ID | Nội dung | Trạng thái |
|---|---|---|
| DEC-001 | React + Electron | Confirmed |
| DEC-002 | UI xây mới theo vision owner; repo anh Tâm chỉ khai thác phần giao tiếp OP | Confirmed về phạm vi; quyền reuse và chi tiết port chưa audit |
| DEC-003 | Nền tảng đích: web, Windows, macOS Intel và Apple Silicon; mong muốn ít hạ tầng vận hành | Confirmed; owner yêu cầu tư vấn lại giả định web không server, chưa chốt kiến trúc |
| DEC-004 | HeroUI Free hay Pro | Open; đề xuất bắt đầu Free |
| DEC-005 | BFF trong handoff | Không còn là kiến trúc mặc định đã chọn; cần đối chiếu DEC-003 |
| DEC-006 | OP là nguồn records và quyền | Kế thừa draft, chưa kiểm chứng instance |

**Proposed:** Insights/hot-cold nâng cao và quản lý team để ngoài trọng tâm đợt đầu, chờ owner chốt. Nhu cầu nhìn lại nỗ lực theo tuần/project hiện là một phần discovery trọng tâm; không loại khỏi MVP chỉ vì từng đề xuất hoãn analytics. Notification được đưa vào MVP theo input mới, thay cho P1 trong handoff. Mọi thu gọn scope phải được owner thống nhất, không tự cắt bước thiết yếu.

## 3. Khung đặc tả mỗi feature

Mỗi feature sẽ có: tình huống thực tế → kết quả cần đạt → mental model → workflow → business rules → visual và trạng thái → motion có mục đích → tâm lý người dùng (bằng chứng/giả thuyết) → acceptance criteria → câu hỏi mở.

Yêu cầu đã được nói rõ vẫn có thể chưa đủ chi tiết để build. Mọi lựa chọn UX dưới đây ghi Proposed nếu owner chưa xác nhận.

## 4. LT-01 — Nhìn thấy phần giờ còn thiếu

**Confirmed:** Xem mức đủ/thiếu theo tuần và tháng; bấm Add để xử lý.

**Mental model đề xuất:** “Mình còn cần bổ sung ngày nào?” Tổng kỳ đi kèm phân rã theo ngày; phân biệt mục tiêu cả kỳ với nghĩa vụ đến thời điểm hiện tại.

**Rule đã biết:** Mỗi thứ Hai phải log đầy đủ; thiếu giờ trong tuần/tháng sẽ bị nhắc. Mỗi ngày thuộc diện phải log cần ít nhất 8 giờ; không bù giờ giữa ngày. Owner muốn nhãn “Well performed” cho 8–12 giờ và “Out standing” cho 12–16 giờ; chưa đóng băng biên nhãn 8/12/16 và trường hợp trên 16. Chưa biết hạn giờ thứ Hai, chốt tuần nào, ngày nghỉ và phép.

**LT-01-R01 — Confirmed:** Với ngày cần log, thiếu ngày = max(0, 8 − giờ đã log hợp lệ của ngày). Thiếu kỳ = tổng thiếu từng ngày thuộc diện tính; kỳ hoàn tất chỉ khi không ngày nào thiếu. Tổng giờ thô của kỳ vẫn hiển thị riêng, không dùng max(0, target kỳ − tổng giờ) để tính thiếu. Ví dụ 6 + 10 + 8 + 8 + 8 = 40 giờ trong tuần 5 ngày: vẫn thiếu 2 giờ ở ngày đầu. Phần xác định ngày thuộc diện tính (phép/lễ/ngày tương lai) còn Open.

**Proposed bảng biên để owner xác nhận:** dưới 8 = thiếu; đúng 8 = đủ; trên 8 đến dưới 12 = Well performed; từ 12 đến 16 = Out standing; trên 16 = trạng thái cần làm rõ, không tự chặn lưu. Đây chưa phải rule được duyệt.

**Confirmed — mục đích nhãn:** Khích lệ và ghi nhận thời gian/nỗ lực dành cho công việc, không chỉ báo hoàn thành nghĩa vụ log. Không tự thay các nhãn owner yêu cầu bằng nhãn trung tính. Các biên giờ và tập entries dùng tính nhãn vẫn Open. Tuần/tháng chưa tự áp nhãn bằng tổng hoặc bình quân.

**Proposed — hai lớp phản hồi:** (1) Hoàn tất ghi nhận: đủ/thiếu giờ theo policy, xanh/check chỉ mang nghĩa dữ liệu đã đủ; (2) Ghi nhận nỗ lực: phản hồi tích cực và recap tuần/project dựa trên dữ liệu đủ điều kiện, có giải thích cơ sở. Giờ log là dấu hiệu thời gian đã ghi nhận, không chứng minh chất lượng, cường độ hay năng suất. Không có dữ liệu thì không tự kể thành tích. Không tự loại personal/internal/meeting/mentoring khỏi tập ghi nhận; cần policy và mapping rõ.

**Proposed visual/motion:** Sau khi OP xác nhận lưu, phản hồi ngắn ở các ngày được cập nhật; recap tuần có phân bổ project và lời ghi nhận dựa trên số liệu. Khi vừa có ngày thiếu vừa có nỗ lực đáng ghi nhận, hiển thị cả hai thay vì để màu đỏ phủ định toàn tuần. Không lặp celebration cho cùng một mốc khi refresh, mở app hoặc edit qua lại; giữ trải nghiệm reduced motion. Tên và thiết kế reward còn cần owner thảo luận, không thêm leaderboard hoặc cơ chế tự nâng target sau tuần nhiều giờ.

**Proposed UX:** Hiện con số và nhãn rõ ràng, không chỉ màu. Add giữ kỳ/ngày đang xem khi mở drawer. Chưa có dữ liệu target thì không kết luận “đủ” hay “thiếu”. Không hiển thị dữ liệu tải lỗi thành 0 giờ.

**Giả thuyết tâm lý:** Phần thiếu cụ thể và có hành động ngay có thể giảm cảm giác một khoản việc tồn đọng khó bắt đầu. Kiểm chứng trong pilot; tránh ngôn ngữ phán xét.

**Proposed acceptance:** Sau khi OP xác nhận log thành công, tổng ngày/tuần/tháng liên quan được đối soát lại. Lỗi tải và mục tiêu chưa cấu hình có trạng thái riêng. Công thức không bù đã chốt ở LT-01-R01; phạm vi ngày tính còn cần Q-01/Q-05.

## 5. LT-02 — Drawer tìm/tạo task và log tại chỗ

**Confirmed workflow:** Từ tuần/tháng → Add → drawer bên phải → browse project và công việc → tìm trong phạm vi đang đứng → chọn hoặc tạo task → log time; có thể update status trong luồng này. Owner làm rõ OP không bắt buộc cấu trúc Project → Sprint → Task. Một số project có Public Work Packages mang tên Sprint 12 hoặc R65 để mọi người vào log.

**Proposed:** Cho chọn/log trực tiếp work package trong project; sprint không phải bước bắt buộc và không tự phân loại chỉ từ tên. “Public” là cách owner mô tả, không suy ra được truy cập vô danh hoặc vượt quyền OP.

**Open:** Người dùng log trực tiếp vào WP Sprint 12/R65 hay task con; tạo task cần những trường gì; status thay đổi độc lập hay đi kèm lúc log; drawer đè hay đẩy nội dung chính.

**Proposed mental model:** Kỳ/ngày là nơi cần điền giờ; project/sprint là nơi tìm công việc; task là đối tượng được log. Breadcrumb và nhãn phạm vi giúp người dùng biết mình đang tìm ở đâu. Mở rộng tìm kiếm là hành động rõ ràng, không âm thầm đổi phạm vi.

**Proposed UX:** Giữ ngày, task và dữ liệu đang nhập khi chuyển bước. Tạo task xong chọn ngay task đó để tiếp tục log. Đóng drawer khi có dữ liệu chưa lưu cần cơ chế bảo vệ phù hợp. Empty/loading/error/no permission phải phân biệt được.

**Proposed motion:** Drawer xuất hiện có hướng để giữ liên hệ với màn hình tuần/tháng; focus vào vị trí hợp lý. Không chờ animation kết thúc mới cho nhập. Trạng thái lưu đang xử lý và đã được OP xác nhận phải khác nhau.

**Giả thuyết tâm lý:** Giữ ngữ cảnh có thể giảm cảm giác phải bắt đầu lại mỗi lần chuyển công cụ.

**Proposed acceptance:** Có thể tìm hoặc tạo task rồi log mà không copy ID; validation giữ nguyên input; nếu tạo task thành công nhưng log lỗi thì retry log không tạo task thứ hai; lỗi đổi status và lỗi log được báo riêng nếu là hai thao tác độc lập.

## 6. LT-03 — Duplicate qua nhiều ngày

**Confirmed workflow:** Bấm menu ba chấm của một time entry → Duplicate → vào duplicate mode có dấu hiệu rõ ràng và hai actions Cancel/Duplicate → chọn các ô ngày → chuyển sang lớp nhập giờ bằng ô số cho từng ngày đã chọn → xác nhận lưu. Mọi ngày đã chọn đều bắt buộc có giờ, không được để trống. Bước nhập giờ là phần của luồng MVP owner cần, không được tự cắt.

**Proposed chi tiết chuyển bước:** Nút Duplicate ở bước chọn ngày mở lớp nhập giờ, chưa ghi OP. Lớp này hiển thị ngày + ô giờ và nút Duplicate xác nhận cuối; có Back để sửa ngày mà giữ các giá trị đã nhập còn phù hợp. Vị trí lớp nhập (drawer/modal/inline) và nhãn nút cuối chưa chốt.

**Proposed:** Banner “Đang sao chép” hiển thị nguồn và số ngày chọn; ngày đích có viền/check, không chỉ màu; bấm lần nữa bỏ chọn; Duplicate disabled khi chưa chọn ngày; Cancel trước khi gửi chỉ thoát mode và không ghi OP. Không mở day detail khi click ngày trong mode. Ctrl + drag không nằm trong tương tác hiện được chọn.

**LT-03-R01 — Confirmed:** Ô giờ từng entry đích ban đầu để trống, không copy giờ nguồn hoặc tự điền mặc định. Mục đích owner nêu: tránh bấm nhầm và tạo khoảng dừng để tự nhìn lại thời gian thực sự đã làm. Không thêm timer ép chờ; không thêm auto-fill làm mất chủ đích này.

**LT-03-R02 — Confirmed:** Trong duplicate mode có Remove cho từng entry đích đang soạn. Remove bỏ entry dự kiến khỏi lượt duplicate, không xóa source hoặc bất kỳ entry đã tồn tại trên OP.

**Proposed chi tiết Remove:** Mỗi dòng ngày/giờ có nút bỏ riêng với accessible label chỉ rõ ngày. Bỏ dòng đồng thời bỏ chọn ngày và cập nhật số lượng/tổng preview; giữ giờ đã nhập ở các dòng còn lại. Bỏ hết thì giữ mode với trạng thái chưa có ngày và vô hiệu hóa submit. Chọn lại ngày đã bỏ tạo ô giờ trống. Motion thu gọn dòng ngắn, không làm mất focus; hỗ trợ reduced motion.

**LT-03-R03 — Confirmed:** Nếu ngày đích đã có log cùng task, ô/dòng entry duplicate đó có màu cam kèm dòng warning; vẫn nhập giờ, Remove và xác nhận Duplicate bình thường. Cảnh báo không chặn submit và không thêm bước xác nhận bắt buộc. Tạo thêm entry theo giờ đã nhập, không gộp hoặc ghi đè entry có sẵn.

**Proposed chi tiết:** So trùng bằng work package ID và ngày làm việc của các time entries thuộc người dùng hiện tại, không so tên task hay timestamp tạo log. Warning gợi ý: “Ngày này đã có log cho task này. Duplicate sẽ tạo thêm một entry.” Dùng chữ/icon cùng màu cam để không phụ thuộc màu. Warning trùng task không bỏ qua validation giờ bắt buộc hoặc quyền OP; lỗi nhập liệu vẫn phải hiển thị rõ.

**Open:** Bước số/giờ lẻ và giá trị 0; copy activity/comment không; cho phép chọn ngày nghỉ/tương lai và chuyển tháng khi chọn không.

**Acceptance đã đủ rõ:** Chọn N ngày tạo N ô nhập giờ trống bắt buộc; không gửi mutation khi còn ô trống trong các entry đích còn giữ; hiển thị lỗi ở đúng ô và giữ các giá trị khác. Remove một entry trống loại nó khỏi payload và validation, không gọi DELETE lên OP. Cancel trước khi gửi không tạo entry; source entry không bị thay đổi. Mỗi entry đích dùng giờ người dùng xác nhận cho ngày đó. Validate thêm theo contract OP đã xác minh.

**Proposed UX/rules:** Preview ngày, task và số giờ trước khi gửi. Báo kết quả theo từng ngày nếu chỉ thành công một phần. Khi mất kết nối và chưa biết kết quả ghi, đối soát trước retry để tránh tạo trùng. Không tự giả định OP hỗ trợ batch transaction hoặc idempotency.

**Proposed motion:** Highlight nguồn và đích giúp thấy quan hệ copy; preview không được trông như dữ liệu đã lưu. Luôn có cách thao tác không cần kéo thả.

## 7. LT-04 — Nhắc log time qua OS

**Confirmed:** Nhắc 17:00 vào working day; tuyệt đối không gửi thứ Bảy/Chủ nhật. Gom các ngày chưa đủ giờ thành một notification. Đóng cửa sổ vẫn chạy nền chỉ cho tác vụ nhắc nhở.

**Confirmed phạm vi:** Gom ngày chưa đủ trong tháng hiện tại, trình bày summary theo tuần. Ví dụ owner mong muốn: “Tuần 05–09/10: đã log 32/40 giờ, chưa đầy đủ”. Đây là ví dụ định dạng cho một tuần 5 ngày đủ điều kiện, không tự suy ra mọi tuần đều có target 40.

**Open:** Gồm hôm nay đến 17:00 không; ngày lễ/phép; timezone; nhắc bù khi máy ngủ; khởi động cùng OS; snooze. Quit hoàn toàn không nằm trong yêu cầu tiếp tục nhắc đã xác nhận. Tuần giao tháng và target tuần đang diễn ra cần rule riêng.

**Proposed:** Chỉ tính ngày thuộc tháng hiện tại và đã đến hạn trong mỗi tuần; không gọi giờ của ngày tương lai là thiếu. Tuần giao tháng ghi rõ khoảng ngày đang tính và target tương ứng. Một noti tổng hợp các tuần thiếu; nếu dài thì hiển thị tổng số tuần/ngày thiếu và mở chi tiết khi bấm, không tách thành nhiều noti.

**LT-04-R01 — hệ quả của rule đã chốt:** Tính ngày thiếu theo LT-01-R01, không bỏ notification chỉ vì tổng tuần đạt target. **Proposed copy:** “Tuần 05–09/10: đã log 40 giờ; còn 1 ngày thiếu 2 giờ.” Với tuần 32/40 thì vẫn báo tổng và ngày thiếu. Không chỉ hiển thị 40/40 màu xanh khi có ngày dưới 8.

**Proposed:** Không có ngày thiếu thì không gửi; chỉ một tổng hợp mỗi mốc nhắc trên một thiết bị, không một noti mỗi ngày thiếu. Gần giờ nhắc tải dữ liệu mới; API lỗi thì không suy diễn là thiếu hoặc đủ. Nếu có catch-up, vẫn kiểm tra lại thứ trong tuần tại thời điểm gửi để không bắn cuối tuần. Chính sách đa thiết bị còn mở.

**Proposed kiến trúc nền:** Khi đóng cửa sổ, giải phóng UI/renderer nếu phù hợp, giữ tiến trình phục vụ scheduler và truy vấn OP cần cho reminder; không chạy chart/animation và refresh UI nền. Đo RAM thực tế vì Electron vẫn có overhead. Có thao tác mở lại và Quit rõ ràng. App đang ngủ/quit không được hứa nhắc đúng giờ. Web tab đóng không được mặc định có cùng khả năng chạy nền như desktop.

**Proposed UX:** Notification dẫn về đúng kỳ/ngày cần bổ sung; lời nhắc trung tính; không hiển thị tên task nhạy cảm trên notification mặc định. Không có quyền notification thì trạng thái trong app giải thích rõ.

**Technical dependency:** Phải kiểm chứng từng nền tảng và trạng thái app. Không cam kết nhắc đúng 17:00 khi app đã quit hoặc máy đang ngủ chỉ dựa vào timer trong app.

## 8. Visual, motion và hiệu năng

**Confirmed:** Có file khai báo tập trung animation/preset/easing/duration/vị trí sử dụng để dễ điều chỉnh; hỗ trợ Reduce Motion. [Motion spec](MOTION-SPEC.md) và [registry sinh tự động](MOTION-REGISTRY.generated.md) mô tả Motion + CSS đã dùng trong prototype BOOT-001. Runtime config là nguồn chung cho Motion/CSS; chart engine chưa có. Preset/duration vẫn cần UAT và chưa benchmark theo budget. Không hardcode rải rác hoặc duy trì bản số liệu tài liệu thứ hai bằng tay.

**Confirmed:** Owner coi motion/chart/animation là một phần chất lượng trải nghiệm; lo giật, lag và RAM cao khiến app bị bỏ dùng.

**Proposed:** Motion phục vụ định hướng, phản hồi và giữ ngữ cảnh. Tôn trọng reduced motion; tránh hiệu ứng lặp không phục vụ tác vụ. Chart ưu tiên trả lời đủ/thiếu và dẫn đến thao tác bổ sung.

Đo bằng production build trên thiết bị pilot: mở app tới lúc thao tác được; mở drawer, search, chuyển tuần/tháng; độ mượt khi animation và tải dữ liệu đồng thời; RAM tổng các process khi mở, dùng lâu, đóng/mở drawer lặp và chạy nền nhắc giờ. Chưa đặt budget số khi chưa biết máy đích và baseline. Electron đã chốt không có nghĩa hiệu năng đã được chứng minh.

## 9. Câu hỏi ưu tiên

- **Q-01 / Owner:** Không bù giữa ngày đã chốt; lời nhắc personal riêng đã bỏ khỏi MVP theo điều kiện owner. Ngưỡng khen dùng toàn bộ giờ hay tập giờ nào? Biên nhãn 8/12/16, trên 16 còn Open. Thứ Hai chốt lúc nào? Phép/ngày lễ lấy ở đâu?
- **Q-02 / Owner:** Log trực tiếp WP Sprint 12/R65 hay task con? Khi tạo task thường bắt buộc nhập gì?
- **Q-03 / Owner:** Giờ ban đầu trống, Remove từng entry đích và warning cam không chặn khi trùng task đã chốt. Vị trí lớp nhập và quy tắc giờ lẻ/0 còn Open.
- **Q-04 / Engineering rồi Owner:** Xác minh OP auth/CORS với môi trường thực tế, tư vấn desktop direct + static web nếu khả thi; chỉ đề xuất BFF nếu có lý do cụ thể. Chưa cần owner tự chọn kỹ thuật.
- **Q-05 / Owner:** Phạm vi tháng, nhóm tuần đã chốt. Tuần hiện tại tính đến hôm nay hay cả tuần? Tuần giao tháng, ngày lễ/phép, timezone và missed reminder còn Open.
- **Q-06 / Owner, sau:** Máy pilot, dung lượng RAM, nền tảng phát hành trước và người dùng pilot bổ sung.
- **Q-07 / Owner, sau:** Có workflow/rules riêng ngoài handoff và trao đổi này cần đưa vào master không?

## 10. Ghi chú nghiên cứu — 2026-10-12

- HeroUI OSS cung cấp nền tảng component React; Pro mở rộng component/template, gồm charts và data display. Đề xuất Free đủ làm nền cho MVP nhưng calendar log giờ, duplicate và workflow vẫn cần thiết kế riêng. Chưa audit component theo màn hình. [OSS](https://heroui.com/en/docs/react/getting-started), [Pro](https://heroui.pro/docs/react/getting-started).
- Web gọi thẳng OP phụ thuộc auth và CORS trên instance. OP có cấu hình bật CORS cho API; chưa xác minh BigIn. [OP admin API settings](https://www.openproject.org/docs/system-admin-guide/api-and-webhooks/).
- Electron hỗ trợ OS notifications; hiệu năng cần đo và tối ưu theo ứng dụng thực tế. [Notifications](https://www.electronjs.org/docs/latest/tutorial/notifications), [Performance](https://www.electronjs.org/docs/latest/tutorial/performance).

Các nguồn trên là tài liệu sản phẩm, không phải bằng chứng runtime BigIn. Chưa đọc source repo anh Tâm, chưa truy cập OP thật, chưa benchmark hoặc kiểm thử ứng dụng.

## 11. Tư vấn kiến trúc — Proposed

Desktop có thể kết nối thẳng server OP có sẵn, không cần dựng backend riêng. Giao tiếp OP đặt trong lớp desktop có quyền phù hợp; renderer gọi qua interface giới hạn. Credential dùng cơ chế bảo vệ của OS, không gửi API key dài hạn vào UI. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security), [safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage).

Web vẫn cần nơi phân phối file frontend (static hosting hoặc hạ tầng công ty). Không nhất thiết cần backend nghiệp vụ riêng, nhưng browser áp ràng buộc CORS và cách auth/lưu token khác desktop. Cần kiểm chứng OP instance hỗ trợ auth phù hợp cho public browser client, không chứa client secret; không mặc định OAuth/PKCE đã hỗ trợ. Không tắt bảo mật browser hoặc nhúng key chung để né vấn đề.

Đề xuất: desktop direct OP cho pilot; frontend và quy tắc dùng chung qua adapters; thử static web direct OP nếu auth/CORS đáp ứng. Nếu không đáp ứng, ghi bằng chứng và so sánh thay đổi cấu hình OP với BFF tối thiểu trước khi quyết định. Đây là đề xuất, chưa phải owner chốt desktop phát hành trước. Phần chạy nền nhắc giờ là khác biệt nền tảng cần ghi rõ.

## 12. Change log

- 0.9: Owner nói “Khởi động dự án đi em”. Bắt đầu BOOT-001 nền tảng/local prototype; không tự coi Open policies thành quyết định được duyệt hoặc kết nối OP production. Runtime motion dùng Motion + CSS theo tư vấn, chưa mua/chọn HeroUI tier. Acceptance dựa trên rule đã chốt; demo assumptions ghi riêng trong task packet.

- 0.8: Owner yêu cầu continuity khi đổi agent/hết context. Tạo START-HERE, WORKFLOW, CURRENT và task template; đây là cơ chế tài liệu, chưa có enforcement tự động. Không thay đổi motion/product rules ở revision này.

- 0.7: Chốt yêu cầu registry motion tập trung và Reduce Motion; tạo MOTION-SPEC với engine/presets/tokens/usages đề xuất; cập nhật agent spec, chưa triển khai production code.
- 0.6: Chốt LT-03-R03: ngày đích có log cùng task hiện warning cam tại entry, không chặn thao tác, vẫn tạo thêm; cập nhật acceptance cho agent.
- 0.5: Chốt mỗi ngày tối thiểu 8 giờ, không bù; công thức thiếu là tổng phần thiếu từng ngày và noti không dựa riêng vào tổng tuần. Bỏ lời nhắc personal chuyên biệt theo điều kiện owner. Chốt ô duplicate trống có chủ đích reflection và Remove từng entry đích; bổ sung rule IDs và acceptance, đồng bộ agent spec.
- 0.4: Bổ sung nhu cầu ghi nhận nỗ lực và bối cảnh owner; đề xuất tách completeness/recognition, giữ ngưỡng và phân loại giờ còn mở; chốt duplicate một entry + lớp nhập giờ bắt buộc từng ngày; chốt noti trong tháng nhóm theo tuần. Cập nhật agent spec tương ứng; chưa triển khai code hay automation kiểm tra đồng bộ.
- 0.3: Ghi nhận mức 8/12/16 và vấn đề biên/nhãn; bỏ giả định sprint bắt buộc; chốt duplicate mode; chốt nhắc working day, không cuối tuần, gom noti và background reminder only; bổ sung tư vấn desktop/web.
- 0.2: Khởi tạo master từ handoff và input discovery đầu tiên.

## 13. Coding workflow và continuity

**Confirmed:** Agent khác phải biết mục tiêu hiện tại, đã làm đến đâu và bước tiếp theo mà không phụ thuộc toàn bộ chat cũ. [Workflow](WORKFLOW.md) mô tả checkpoint nhỏ, task packets, evidence và recovery. [CURRENT](work/CURRENT.md) lưu trạng thái tiếp quản thực tế; master không lưu progress coding thay cho checkpoint.

**Proposed operational details:** Cập nhật checkpoint trước/sau nhóm sửa có ý nghĩa và sau kiểm tra, không chờ hết context; đối soát Git diff khi tiếp quản; không coi Implemented là Verified hoặc Accepted. Khung file đã tạo, chưa có tự động enforce hoặc app implementation.
- 0.10 (2026-10-12): Owner chốt P-01 phương án A: ngày phải log là T2–T6, bỏ qua ngày tương lai; phép/lễ nhập tay trong app ở bản pilot cho đến khi có nguồn từ OP/HR. Owner giao agent đề xuất tên nhãn cho P-03 (chỉ copy hiển thị); biên 12/16 chưa chốt. Task tiếp theo chờ owner polish UI/UX.
- 0.11 (2026-10-12): Owner yêu cầu toàn bộ UI hiển thị bằng tiếng Anh. Tài liệu nội bộ vẫn tiếng Việt. Chuỗi hiện có trong UI prototype và thông báo lỗi của packages/op (đang tiếng Việt) cần chuyển sang tiếng Anh; chưa làm, chờ owner polish UI để tránh xung đột.
