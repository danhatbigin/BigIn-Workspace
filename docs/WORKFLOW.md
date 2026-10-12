# Workflow liên tục giữa các agent

Revision: 0.1 | 2026-10-12

**Confirmed:** Owner cần agent khác tiếp quản được khi hết token/context/quota: biết đang làm gì, đến đâu và tiếp theo làm gì.

**Cơ chế đề xuất, đã tạo khung tài liệu:** Trạng thái được lưu trong repo theo checkpoint nhỏ, không phụ thuộc khả năng chuyển lịch sử chat. Không bảo đảm khôi phục mọi thao tác chưa kịp lưu khi agent bị ngắt đột ngột; quy trình recovery bên dưới xử lý khoảng trống đó.

## 1. Phân chia nguồn thông tin

| File | Nội dung chịu trách nhiệm |
|---|---|
| MASTER.md | Hành vi sản phẩm, quyết định owner, yêu cầu còn mở |
| MOTION-SPEC.md | Intent/preset/usage motion và trạng thái duyệt |
| AGENT-SPEC.md | Quy tắc triển khai và bằng chứng chất lượng |
| work/CURRENT.md | Checkpoint tiếp quản ngắn: task hiện tại, trạng thái, đường dẫn và bước tiếp |
| work/tasks/<ID>.md | Task packet: scope, source revision, tiến độ và evidence của task đó |
| Git diff/commit + kết quả kiểm tra | Bằng chứng về code thực sự tồn tại và trạng thái đã kiểm chứng |

Không copy toàn master vào CURRENT hoặc task packet. CURRENT chỉ dẫn tới packet; thông tin task chi tiết lưu tại packet. Mọi mâu thuẫn tài liệu/code cần được đối soát, không coi lời tóm tắt là bằng chứng thay thế test hoặc quyết định owner.

## 2. Chia công việc để tiết kiệm context

Mỗi task có một outcome đủ nhỏ và kiểm chứng được, các requirement IDs, phạm vi file dự kiến, dependencies và AC. Không giao kiểu “build toàn bộ time tracking” trong một packet.

Ví dụ phân tách tương lai: cấu trúc duplicate mode; nhập giờ và Remove; phát hiện trùng task; tích hợp ghi và partial failure. Đây chưa phải backlog được duyệt hoặc lệnh bắt đầu build.

Agent mới đọc entrypoint → CURRENT → packet → requirement/code liên quan. Đọc thêm khi cần, không cố giới hạn context bằng cách bỏ rule quan trọng. Ghi lại các hướng đã thử không thành công và lý do để tránh thử lại vô ích; không lưu suy luận nội bộ hoặc toàn bộ transcript.

## 3. Checkpoint khi nào

- Trước một nhóm sửa có ý nghĩa: ghi mục tiêu/bước định làm và file liên quan.
- Sau nhóm sửa: ghi cái đã tồn tại, còn dở và bước tiếp cụ thể.
- Sau test/build: ghi command chính xác, thời điểm, kết quả, code state và đường dẫn evidence nếu có.
- Sau quyết định owner hoặc thay đổi scope: cập nhật master nếu phù hợp rồi đối soát packet.
- Trước chuyển task, kết thúc lượt hoặc khi nhận thấy context/quota sắp cạn: chốt CURRENT. Không đợi tới lúc “hết token”; agent không luôn biết chính xác giới hạn còn lại.

Không ghi sau mỗi dòng code. Mục tiêu là checkpoint sau từng đơn vị công việc có thể mô tả/khôi phục. Nếu còn process đang chạy: lưu cách kiểm tra, log path, trạng thái cuối đã biết; session ID chỉ là gợi ý và có thể không dùng được ở agent khác.

## 4. Trạng thái và bằng chứng

Task status: Draft → Ready → In progress → Implemented → Verified → Accepted. Có thể Blocked kèm nguyên nhân và việc độc lập còn làm được.

- Ready: scope/AC và dependency cần thiết đã đủ; không biến assumption thành quyết định owner.
- Implemented: sửa đã có; chưa đồng nghĩa pass test.
- Verified: có kiểm tra thích hợp trên đúng code state, nêu phạm vi và giới hạn; không nói đã kiểm thử nền tảng chưa chạy.
- Accepted: owner đã nghiệm thu; agent không tự đánh dấu thay owner.

Evidence tối thiểu: command hoặc thao tác kiểm tra, expected/actual, PASS/FAIL/NOT RUN, ngày giờ, commit hoặc snapshot/diff liên quan. Code thay đổi sau test thì ghi rõ evidence cũ không cover thay đổi mới. Chỉ rerun phần bị ảnh hưởng hoặc có lý do nghi ngờ.

Đề xuất commit sau mốc nhất quán khi workflow Git đã cho phép; không tự commit thay đổi của người khác hoặc auto-push. Nếu chưa commit, ghi rõ files và phần dang dở. Checkpoint trong working tree vẫn giúp cùng máy tiếp quản nhưng không tự có mặt trên máy khác; chuyển máy cần bàn giao cả checkout/uncommitted files hoặc Git commits được cho phép, không chỉ file CURRENT.

## 5. Recovery khi bị ngắt đột ngột

1. Kiểm tra repo/branch/HEAD và working tree; so với CURRENT và packet.
2. Đọc diff ở file liên quan để tìm phần đã sửa sau checkpoint. Không reset hoặc clean untracked files.
3. Tách rõ “đã thấy code”, “đã có kết quả kiểm tra”, “chưa biết”. Không nâng status chỉ vì agent trước ghi “gần xong”.
4. Với test/process chưa rõ kết quả, đọc evidence hoặc chạy lại kiểm tra thích hợp. Với thao tác ghi dữ liệu bên ngoài chưa rõ kết quả, đối soát trước retry, không gửi lại mù.
5. Cập nhật checkpoint đã phục hồi và tiếp tục bước kế tiếp. Hỏi owner chỉ khi thiếu quyết định không thể suy ra an toàn từ tài liệu/code.

## 6. Đồng bộ và ownership

Trước sửa, ghi agent/session nhận task và source master revision. Khi master thay đổi, rà soát requirements liên quan trước khi tiếp tục; revision khác chỉ là tín hiệu, không kết luận toàn bộ task vô hiệu.

Hiện mặc định một agent thực thi tại một thời điểm. Nếu sau này owner yêu cầu chạy nhiều agent, mỗi agent có packet/ownership riêng, dùng worktree khi phù hợp; một bên cập nhật CURRENT tổng để tránh ghi đè. File ghi ownership không phải khóa kỹ thuật, không bảo đảm loại trừ agent khác.

Không lưu key/token, dữ liệu khách hàng không cần thiết hoặc thông tin đăng nhập vào handoff. Không tuyên bố có CI/hash checks tự động khi mới chỉ có hướng dẫn Markdown.

## 7. Thông điệp giao cho agent mới

“Tiếp tục dự án từ START-HERE.md. Đọc checkpoint và task packet, đối soát với working tree, rồi tiếp tục bước tiếp theo trong scope đã duyệt. Giữ nguyên các thay đổi đang có. Cập nhật checkpoint sau mỗi mốc có ý nghĩa; chưa chuyển phase hoặc tự chốt các quyết định đang Open.”
