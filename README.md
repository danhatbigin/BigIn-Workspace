# BigIn Employee Workspace

Local preview đầu tiên: React + TypeScript + Vite + Motion, cùng Electron shell.

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
- Motion registry dùng chung và Reduce Motion theo OS hoặc tùy chọn trong phiên.
- Dữ liệu mẫu lưu localStorage, key `bigin-demo-v1`, riêng từng origin/profile. Không lưu credential.

Chưa có OpenProject auth/API, nhắc 17:00 chạy nền, installer ký số, macOS QA, lịch phép/lễ hoặc nhãn khen thưởng. Đóng cửa sổ desktop hiện thoát app. Không phải production release. Mọi task tạo trong app đều là local sample.

## Tiếp quản

Đọc [START-HERE.md](START-HERE.md), [CURRENT](docs/work/CURRENT.md), rồi task packet được chỉ định. Không đọc toàn chat để đoán trạng thái.
