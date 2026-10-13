# BigIn Employee Workspace

Local preview đầu tiên: React + TypeScript + Vite + HeroUI, cùng Electron shell.

## Chạy

Yêu cầu Node.js 22.12+ (đã kiểm tra trên Node 24.16), npm và kết nối mạng cho lần cài đầu.

```text
npm ci
npm run dev
```

Mở http://127.0.0.1:5173. Chạy desktop: `npm run desktop` (build rồi mở Electron).

## Kiểm tra

```text
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:desktop
```

`npm run motion:docs` sinh bảng motion từ `packages/ui/src/motion/motion.config.ts`; `npm run docs:check` phát hiện bảng cũ. Trong app có màn Chuyển động đọc cùng config.

## Phạm vi bản đầu

- Calendar tuần/tháng, tổng giờ và thiếu từng ngày, không bù giờ.
- Drawer tìm/chọn/tạo task và log giờ local.
- Duplicate từ entry, chọn ngày, ô giờ trống, Remove và warning cam không chặn.
- HeroUI CSS timing registry dùng chung và Reduce Motion theo OS hoặc tùy chọn được lưu.
- Dữ liệu mẫu lưu localStorage, key `bigin-demo-v1`, riêng từng origin/profile. Không lưu credential.

Chưa có OpenProject auth/API, nhắc 17:00 chạy nền, installer ký số, macOS QA, lịch phép/lễ hoặc nhãn khen thưởng. Đóng cửa sổ desktop hiện thoát app. Không phải production release. Mọi task tạo trong app đều là local sample.

## Tiếp quản

Đọc [START-HERE.md](START-HERE.md), [CURRENT](docs/work/CURRENT.md), rồi task packet được chỉ định. Không đọc toàn chat để đoán trạng thái.

UI polish: HeroUI Free v3 + Tailwind v4 đã tích hợp. Hướng dẫn cho agent ở docs/UI-GUIDANCE.md; theme ở packages/design-tokens/src/theme.ts, runtime/styles dùng chung ở apps/web/src/system. Legacy polish.css/tokens.css đã xóa; custom components phải compose từ system. Các data rules/local preview limitations ở trên vẫn áp dụng.

Design token preview: http://127.0.0.1:5173/design-system (Electron: #design-system). Source model ở packages/design-tokens/src; spec/export artifacts ở docs/design-system. Workspace và preview dùng cùng token resolver/settings, không còn legacy skin. Có Light/Dark, preset Neutral/BDS, profile controls, component/dashboard composition và JSON/CSS export. Run npm run tokens:docs và npm run tokens:audit sau sửa; npm run check kiểm tra artifact consistency.

Windows live pilot: xem docs/WINDOWS-PILOT.md. Build Windows x64 portable bằng npm.cmd run build:windows. First-run nhập API token để đọc và ghi log time thật lên op.bigin.vn; token được mã hóa trong desktop main. Web vẫn demo. Release chưa ký; WP creation/status và reminders chưa bật. test:desktop dùng server mô phỏng, không ghi production.
