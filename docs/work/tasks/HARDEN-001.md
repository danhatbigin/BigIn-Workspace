# HARDEN-001 — Củng cố repo, journal và bản release sau scan kiến trúc

- Status: Verified local, chờ owner UAT; chưa Accepted
- Owner agent/session: Claude (Cowork), 2026-10-13
- Updated at / timezone: 2026-10-13 Asia/Saigon
- Source master revision + requirement IDs: MASTER 0.15, LT-03 (duplicate), DEC-003 (Open, xem dưới)
- Branch / base commit / workspace: wip/win-pilot-0.2.1, D:/Projects/BigIn-Workspace
- Dependencies / quyết định cần có: owner retest WIN-LIVE-002 trên OP thật; chứng chỉ ký; quyết định DEC-003

## Outcome và scope được duyệt

Owner yêu cầu xử lý toàn bộ các điểm rủi ro nêu ở scan 2026-10-13: code chưa commit, journal uncertain kẹt, release chưa củng cố, hygiene repo. Không đổi business policy, không ghi OP thật, không push.

## Acceptance criteria / evidence mapping

| Mục | Implementation | Cách kiểm tra | Evidence | Code state |
|---|---|---|---|---|
| Code an toàn trong git | 3 commit trên wip/win-pilot-0.2.1 + commit HARDEN-001, tag v0.2.2 | git log | Xong; CHƯA push (origin/main không tồn tại) | committed |
| Journal: sửa giờ/note không né guard | op-service.cjs `slot` = hash(server,user,task,date) | desktop-live-smoke.mjs (edited-attempt) | PASS dev + packaged smoke | committed |
| Journal: nút xác nhận đã kiểm tra OP | op-service `resolve`, IPC op:resolve, preload, Drawer, DuplicateDialog | smoke: resolve 0 và 1 entry, retry chạm server lần 2 | PASS; UI button chưa có test e2e riêng | committed |
| Hook test không nằm trong release | apps/desktop/smoke-hooks.cjs, package-windows.mjs | asar list không có smoke-hooks | PASS | committed |
| asar + fuses | package-windows.mjs, @electron/asar, @electron/fuses | fuses read; .local/verify-release.mjs | RunAsNode/NODE_OPTIONS/inspect tắt, OnlyLoadAppFromAsar bật; exe lên first-run, bridge đủ 7 hàm, không có window.require | committed |
| Version một nguồn | package.json 0.2.2, script đọc version | build ra BigIn-Workspace-0.2.2 | PASS | committed |
| CI | .github/workflows/ci.yml, script `ci`, engines | CHƯA chạy trên GitHub (chưa push) | NOT RUN | committed |
| op-write-test.mjs không còn trong git | chuyển sang .local/ (gitignored) | git ls-files | Xong | committed |

Kiểm tra đã chạy trên Windows (Node 24): check PASS (typecheck, 56 tests, docs, tokens), e2e Chromium 17/17, test:desktop PASS cả dev lẫn smoke-exe đóng gói, build:windows PASS.

## Checkpoint

- Đã hoàn thành: bảng trên.
- Việc cần owner: (1) retest 0.2.2 trên OP thật bằng token của anh; (2) code signing certificate để hết SmartScreen; (3) chốt DEC-003 trước khi đầu tư auto-update (updater cần chỗ host bản build, có thể GitHub Releases private hoặc share nội bộ); (4) tạo repo GitHub/xác nhận remote rồi push; (5) test bằng tài khoản OP quyền thấp; (6) macOS cần máy Mac để build/QA.
- Chưa làm: auto-update, signing, macOS, EnableEmbeddedAsarIntegrityValidation (cần ký + metadata integrity), recovery UI cho journal ngoài nút resolve, e2e cho nút resolve.
- Hướng đã bỏ: giữ hook trong main.cjs có điều kiện env (vẫn nằm trong binary release).
- Thay đổi chưa commit: không.
- Giữ: release/BigIn-Workspace-0.2.1-win-x64(.zip) cho đến khi owner retest xong; 0.2.0 chuyển vào release/_superseded.

## Hoàn tất / bàn giao

Chưa Accepted. Không push, không ghi OP trong lượt này.
