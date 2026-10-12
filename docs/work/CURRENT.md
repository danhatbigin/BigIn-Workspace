# Checkpoint hiện tại

2026-10-12 Asia/Saigon | Codex | Phase: local prototype đã triển khai, chờ owner UAT

## Task vừa hoàn tất

[BOOT-001](tasks/BOOT-001.md), nguồn MASTER 0.9. Status Verified trong phạm vi prototype, chưa Accepted. Owner đã yêu cầu khởi động; không quay về giả định chưa được phép code.

## Đã có

React/TS/Vite + Electron shell; calendar tuần/tháng; drawer tìm/tạo task local; duplicate chọn ngày → giờ trống từng ngày → Remove/warning cam → lưu; quy tắc không bù giờ; Motion/CSS từ config chung và Reduce Motion; localStorage demo.

npm run check PASS (typecheck, 7 domain tests, motion docs check); 8 Chromium E2E PASS; production build PASS; Electron Windows smoke PASS. Evidence chi tiết trong packet. Mac/live OP/notifications chưa kiểm thử hoặc triển khai.

## Chạy lại / preview

- Local preview đã khởi chạy ở http://127.0.0.1:5173/; tool session 57928 có thể không còn sống khi đổi agent. Kiểm tra cổng trước khi mở server mới; không dừng process không rõ chủ sở hữu.
- npm run dev: web; npm run desktop: build + desktop.
- README.md có hướng dẫn; node_modules và package-lock đã cài. Node đã dùng: 24.16.0.
- Yêu cầu mở preview ở panel Codex đã trả queued; không khẳng định user đã nhìn thấy panel.

## Bước tiếp theo

Xem mục "Cập nhật 12:20" ở cuối file (POLICY-001, OP-AUDIT-001, commit đầu). Chờ owner trải nghiệm/steer. Nếu có chỉnh UI/flow, tiếp tục packet nhỏ và chạy kiểm tra liên quan. Trước tích hợp thật, chuẩn bị OP capability/auth audit; chưa có server URL hoặc tài khoản test. Không tự mở rộng scope thành full production MVP.

## Git / trạng thái bàn giao

D:/Projects/BigIn-Workspace, branch main chưa có commit. Source/docs và lockfile đang untracked, chưa push/deploy/PR. Build outputs/node_modules/test-results được gitignore. Không reset hoặc clean. Đối soát git status/diff/files trước tiếp quản.

## Điều chưa có

OP API/auth, nhắc 17:00 chạy nền, installers/signing/macOS validation, HR calendar, reward thresholds. HeroUI chưa chọn tier; prototype dùng CSS/semantic primitives. Handoff còn thủ công; chỉ có automation đối chiếu motion registry, chưa enforce master/task revisions.

## Re-verify khi tiếp quản (Claude, 2026-10-12 ~12:05 Asia/Saigon)

Đối soát: working tree khớp CURRENT (main, chưa commit, file untracked). Chạy lại trên Windows (Node 24.16.0): npm run check PASS (7/7 domain tests, docs:check); npm run test:e2e 8/8 PASS; npm run test:desktop PASS. E2E lần đầu fail do thiếu Playwright Chromium trên profile này; đã chạy npx playwright install chromium (lỗi môi trường, không phải code). Preview 5173 vẫn đang listen. Không đổi code; status vẫn Verified, chờ owner UAT. Lưu ý: PowerShell chặn npm.ps1 — chạy npm bằng cmd.

## Cập nhật 12:20 (Claude) — theo yêu cầu owner: kiểm tra 3 hướng rồi làm tiếp, owner chỉnh UI sau

- [POLICY-001](tasks/POLICY-001.md): bảng P-01..P-11 gom câu hỏi Open kèm đề xuất mặc định. Chờ owner trả lời; chưa đổi MASTER, chưa đổi code.
- [OP-AUDIT-001](tasks/OP-AUDIT-001.md): Blocked, cần base URL/version OP, tài khoản test, quyền đọc repo anh Tâm. Checklist 12 mục NOT RUN.
- Git: tạo commit khởi tạo trên main cho source/docs/lockfile hiện có (không push). Chạy lại evidence BOOT-001 trước commit: check/e2e 8/8/desktop PASS.
- Ghi chú môi trường: chạy npm bằng cmd (PowerShell chặn npm.ps1). Sandbox Linux của Claude không chạy được node_modules Windows; chạy test qua Desktop Commander trên máy Windows.
- Bước tiếp: owner trả lời POLICY-001, cấp input cho OP-AUDIT-001, UAT UI.

## Cập nhật 12:50 (Claude)

- OP-AUDIT-001: owner dán GET /api/v3 (mục 1 PARTIAL PASS). Đã đọc repo tham chiếu tammai/op-time-tracker-tauri (clone ở D:\Projects\op-time-tracker-tauri, ngoài repo); ghi ghi chú vào packet. **Repo đó không có LICENSE: không copy code khi chưa có xác nhận của anh Tâm.**
- Bước tiếp: owner hỏi anh Tâm về quyền reuse; owner dán thêm JSON GET chỉ đọc (configuration, users/me, time_entries) để đối chiếu với repo.

## Cập nhật 13:10 (Claude)

- OP-AUDIT-001: thêm Evidence từ configuration/users/me/time_entries (xem packet). Điểm cần nhớ: tài khoản xem được time entries của nhiều người, nên mọi truy vấn phải lọc user=me; perPageOptions [20,100]; offset là số trang; OP có dấu hiệu chứa dữ liệu phép/Personal Time dưới dạng work package (chưa xác nhận).
- Bước tiếp: owner dán GET /api/v3/time_entries/schema và truy vấn tháng 10 lọc user=me; hỏi anh Tâm về LICENSE; trả lời POLICY-001 (P-01 có thêm gợi ý nguồn dữ liệu phép).

## Cập nhật 13:30 (Claude)

- OP-AUDIT-001: mục 6 PASS (lọc user=me + spentOn), mục 7 PARTIAL (đã đọc schema). Evidence lượt 2: 16 entry / 97 giờ tháng 10, ngày nào cũng ≥ 12h; hai ngày đúng biên 12 và 16. Bổ sung 4 ý vào POLICY-001.
- Chưa làm: mục 2 (auth ngoài session), 3 (CORS), 5 (tìm work package), 8-10 (form POST, tạo WP, batch/partial). Không ghi dữ liệu lên OP.
- Bước tiếp: owner trả lời POLICY-001 (ưu tiên P-03 biên, P-05 log không cần WP); hỏi anh Tâm về LICENSE; sau đó em đề xuất task adapter OP chỉ đọc.
