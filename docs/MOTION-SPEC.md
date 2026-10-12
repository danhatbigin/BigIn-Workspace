# Motion registry và lựa chọn engine

Revision: 0.2 | 2026-10-12 | Tham chiếu MASTER.md 0.9; BOOT-001

**Confirmed:** Owner yêu cầu một nơi khai báo animation đang dùng ở đâu, preset, easing và duration để dễ chỉnh; đồng ý Reduce Motion.

**Proposed:** Dùng Motion for React (package `motion`, API `motion/react`) cho chuyển động theo trạng thái React; CSS transitions cho hover/focus/màu và các hiệu ứng đơn giản. Motion + CSS đã được dùng làm implementation default cho local prototype theo yêu cầu khởi động; preset/duration vẫn cần owner UAT, chưa có performance budget được chốt. Package đã cài và có implementation.

## 1. Nguồn cấu hình

File cấu hình có kiểu `packages/ui/src/motion/motion.config.ts` đã được tạo với ba phần tokens/presets/usages; component tham chiếu usage ID, không tự viết duration hoặc easing rải rác. File này giữ intent/policy; thông số thực thi nằm ở config và bảng được sinh từ nó.

Bảng thông số và usages được sinh từ config và có docs:check đối chiếu tự động. Master giữ intent và rules. CSS custom properties và Motion transitions lấy cùng nguồn; chart adapters tương lai phải dùng cùng policy. Không dùng MotionConfig như một cơ chế tự quản lý toàn bộ CSS/chart của thư viện khác.

Mỗi usage có: ID, requirement ID, vị trí, trigger, preset ID, engine owner, reduced preset, replay policy và trạng thái đề xuất/duyệt/đã triển khai. File source/component và evidence được bổ sung khi implementation tồn tại. Không coi danh sách dưới đây là animation đã chạy trong app.

## 2. Phân biệt thuật ngữ

- Effect/preset: fadeIn, fadeOut, drawerEnter, rowExit… mô tả cái gì thay đổi.
- Easing: easeIn, easeOut, easeInOut… mô tả nhịp chuyển đổi, không phải một effect độc lập.
- Duration: lưu thống nhất milliseconds; adapter đổi sang seconds khi API yêu cầu.
- `resolve`: chưa được owner định nghĩa là hiệu ứng cụ thể. Nếu ý là phản hồi lưu thành công, tên semantic đề xuất `saveConfirmed`; không coi resolve là built-in preset.
- Khởi đầu dùng tween với duration rõ. Nếu thêm spring sau này, khai báo riêng stiffness/damping/mass hoặc duration-based spring; không ghép thông số vật lý và duration tùy tiện.

## 3. Runtime tokens, presets và usages

Nguồn duy nhất: `packages/ui/src/motion/motion.config.ts` đã tồn tại. [Bảng sinh tự động](MOTION-REGISTRY.generated.md) ghi usage, preset, duration, easing, engine và file triển khai. Chạy `npm run motion:docs` để cập nhật; `npm run docs:check` kiểm tra khớp. Màn Chuyển động trong app đọc cùng config.

Không giữ bảng thông số thủ công thứ hai trong spec. Hiện demo saveConfirmed là phản hồi lưu local, không phải xác nhận từ OP. Chưa có animation reward theo ngưỡng vì rule chưa chốt. App dùng domMax cho row layout; không tuyên bố tải lazily ở mức feature bundle trong bản này.

## 6. Engine và tích hợp

- Motion for React phụ trách enter/exit và phối hợp layout/state; AnimatePresence hỗ trợ exit khi component được gỡ.
- LazyMotion + m cho phép chọn/tải feature theo nhu cầu. Bắt đầu với domAnimation cho opacity/transform/exit; layout animation của rowRemove cần feature hỗ trợ layout (domMax), không tuyên bố domAnimation đã cover. Quyết định tách bundle sau khi đo; không hứa kích thước tải ban đầu bằng tổng footprint runtime.
- HeroUI v3 dùng CSS-based animations. Nếu chọn v3, mỗi thuộc tính/element chỉ có một bên điều khiển: giữ hiệu ứng built-in phù hợp và map tokens, hoặc tắt/thay hiệu ứng đó. Không bọc thêm Motion rồi để hai engine cùng điều khiển transform/opacity.
- Chưa cần GSAP, Rive hoặc Lottie cho scope này. Chart library chưa chọn; adapter chart phải dùng timing/reduced policy chung hoặc tắt animation riêng. Không lấy HeroUI Pro làm điều kiện bắt buộc để có motion.
- Motion là đề xuất dựa trên workflow React, không phải kết quả benchmark so sánh engine. Đo trên Web và Electron production builds trước khi gọi là đạt hiệu năng.

## 7. Reduce Motion và kiểm chứng

Default đề xuất theo OS; tùy chọn trong app “Theo hệ thống / Giảm chuyển động” là Proposed. MotionConfig reducedMotion=user xử lý transform/layout của Motion; dùng policy chung và hook/custom logic cho hiệu ứng còn lại, CSS media query cho CSS, adapter riêng cho chart.

Khi reduced: không trượt/scale/layout animation, không particles/confetti; giữ màu/check/text và fade ngắn nơi hữu ích. Không mất feedback, focus, khả năng nhập hoặc thông báo lỗi. Chuyển preference lúc app đang mở phải cập nhật mọi engine.

Không trì hoãn API/input để đợi animation; chuyển nhanh/reverse/cancel không để lớp invisible chặn click. Chỉ phản hồi saveConfirmed sau xác nhận OP; không phát lại trên refresh. Animation không tạo mutation. Remove giữ focus hợp lý và input các dòng còn lại. Khi cửa sổ đóng chạy reminder only, không tiếp tục animation UI.

Kiểm chứng: click nhanh/mở đóng liên tiếp, Remove nhiều dòng, warning cùng validation error, partial success, OS Reduce Motion, performance khi lịch có dữ liệu đại diện và CPU bận. Đã có implementation local; evidence và giới hạn xem docs/work/tasks/BOOT-001.md. Chưa coi test Chromium/Windows là bằng chứng macOS hoặc hiệu năng đạt budget.

## 8. Nguồn kiểm tra 2026-10-12

- [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion)
- [Motion bundle size](https://motion.dev/docs/react-reduce-bundle-size)
- [Motion accessibility](https://motion.dev/docs/react-accessibility)
- [MotionConfig](https://motion.dev/docs/react-motion-config)
- [HeroUI v3 migration — CSS animations](https://heroui.com/en/docs/react/migration/full-migration)

