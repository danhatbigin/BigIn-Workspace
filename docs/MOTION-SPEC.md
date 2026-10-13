# Motion registry và engine hiện tại

Revision: 0.3 | 2026-10-12 | MASTER 0.14; DS-002

Owner yêu cầu registry tập trung cho preset/easing/duration/vị trí sử dụng và Reduce Motion. DS-002 chuyển UI sang stock HeroUI CSS, gỡ Motion package và wrappers custom trước đó. Không thêm engine thứ hai lên transform/opacity native components.

Nguồn timing: packages/ui/src/motion/motion.config.ts → packages/design-tokens/src/theme.ts → system/useSystemTheme.ts → system/adapters.css. Bảng MOTION-REGISTRY.generated.md sinh từ config; motion:docs/docs:check đối chiếu. Duration là milliseconds, easing cubic-bezier. Shape/geometry/keyframes là implementation của HeroUI, không nhận stock animation là custom preset do mình tạo.

Control/selection dùng fast; overlays dùng panel; drawer exit dùng fast khi overlay còn mounted (Theme Lab). Feature Drawer/DuplicateDialog unmount trực tiếp khi đóng/save nên không bảo đảm native exit chạy hết. Alert/mode/warning và Remove trực tiếp, không còn rowExit/layout animation. Remove vẫn giữ focus/draft các dòng còn lại, không viết mutation do animation.

Reduce Motion = OS preference OR saved setting dùng chung Lab/workspace. Runtime đổi timing về 0ms và data-reduce-motion cho native library policy. Không delay input/save hoặc làm mất warning/confirmation. Chưa có chart engine/reward animation; nếu thêm phải consume registry/reduced policy.

Evidence Chromium và Electron Windows trong DS-002. Chưa benchmark RAM/INP hoặc macOS, không suy ra hiệu năng production từ build thành công. Motion for React có thể được đánh giá lại khi có interaction cần phối hợp layout/state mà stock components không cover; hiện không cài sẵn engine không được dùng.
