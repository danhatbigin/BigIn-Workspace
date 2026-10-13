# Checkpoint hiện tại

> Checkpoint mới nhất luôn ở đầu file; các mục bên dưới là lịch sử, không theo thứ tự thời gian chặt chẽ.

## Checkpoint mới nhất — Claude, 2026-10-13, HARDEN-001

[HARDEN-001](tasks/HARDEN-001.md) Verified local, chờ owner UAT. Code đã commit trên branch wip/win-pilot-0.2.1 (chưa push, origin/main không tồn tại), tag v0.2.2. Journal: guard theo task + ngày, thêm nút "I checked OpenProject — allow retry" (IPC op:resolve). Release 0.2.2: asar + fuses, smoke-hooks tách khỏi bản release; smoke dùng build riêng (npm run build:windows:smoke). Version lấy từ package.json. CI workflow đã viết, chưa chạy. op-write-test.mjs chuyển sang .local/ (gitignored). Evidence: check 56/56, e2e 17/17, test:desktop PASS (dev + smoke exe), build:windows PASS. Cần owner: retest OP thật, signing cert, chốt DEC-003, remote GitHub, tài khoản quyền thấp. 0.2.1 giữ chờ retest; 0.2.0 ở release/_superseded.


## Checkpoint mới nhất — WIN-LIVE-002, 2026-10-12

Owner báo Add/Duplicate lỗi `OpenProject needs valid fields: user.` [WIN-LIVE-002](tasks/WIN-LIVE-002.md) sửa adapter own-user: bỏ user tường minh mặc định, chỉ thêm nếu form requires + writable; guard form/response đúng actor. Mock cũ bỏ sót readonly/default user đã sửa. Check 56/56 PASS; desktop EXE 0.2.1 regression với mock readonly cover cả Add/Duplicate. Artifact release/BigIn-Workspace-0.2.1-win-x64.zip, đóng 0.2.0 trước khi mở mới; token/app identity giữ nguyên. Live instance vẫn chờ owner retest, không agent ghi OP hoặc lấy token. Validation detail mới được redact/gắn vào error UI cho triage. MASTER 0.15 không đổi business policy; package/handoff trong packet. Các checkpoint dưới là lịch sử.

## Checkpoint mới nhất — Codex, 2026-10-12, WIN-LIVE-001

Owner yêu cầu build Windows first-run API token và xác nhận đọc + ghi log time thật. [WIN-LIVE-001](tasks/WIN-LIVE-001.md) Verified artifact/mock contract, chờ owner live UAT. MASTER/AGENT-SPEC 0.15. Main/preload + DPAPI token store, DesktopEntry onboarding, user-scoped reads/range/WP search, Add/Duplicate async real POST, per-entry outcomes/journal. Không trộn demo, không auto-retry unknown hoặc đóng modal sớm khi còn unknown rows. Live WP create/status/notifications chưa enabled; Web vẫn demo.

Artifact release/BigIn-Workspace-0.2.0-win-x64.zip (~152 MiB), self-contained portable unsigned; giải nén toàn bộ/mở BigIn Workspace.exe, nhập token trong app. [Hướng dẫn](../WINDOWS-PILOT.md). 53 tests/check PASS, 17 Chromium PASS, Windows build PASS, mock integration trên chính EXE PASS. Latest artifact hash trong packet. First-run ảnh docs/design-system/windows-first-run.png. Không test write trên OP production; owner nhập token/UAT mới xác minh instance.

Next: owner UAT; ghi error/status và kiểm tra OP trước retry unknown. Không tự chạy op-write-test.mjs hoặc thu token qua chat. Recovery journal UI chưa có, activity picker/HR calendar/installer/signing/macOS/performance là scope riêng. Branch main HEAD b207845, changes chưa commit/push, gồm DS và WIN-LIVE files; preserve existing work. Các checkpoints dưới là lịch sử.

## Checkpoint mới nhất — Codex, 2026-10-12, DS-002

Owner đã review Lab và ra lệnh áp system vào workspace, clean legacy custom; thực hiện [DS-002](tasks/DS-002.md) Verified local, chờ owner UAT. MASTER/AGENT-SPEC 0.14. Hai routes cùng resolver/runtime/settings/styles; stock HeroUI overlays/controls, calendar compose ToggleButton/Chip/ProgressBar; native Dialog và legacy styles/polish/tokens CSS xóa, Motion package cũ gỡ. Policy mới: compose-only, semantic tokens/public variants; adapters disclosed/audited, không skin riêng.

Evidence: check 47/47; full Chromium 17/17; build; Electron Windows smoke PASS. Sau layout self-start cuối, hai test visual/sync PASS và warning snapshot đã chờ đủ backdrop/container animation. Ảnh xem/copy tại docs/design-system/workspace-*.png. Stock exit có thể bị cắt bởi feature unmount; không claim layout animation Remove hoặc performance budget đã đạt. Chưa kiểm chứng macOS/full a11y/RAM.

Next: owner UAT hoặc feature được chỉ định. Không tự quay lại polish.css hoặc tiếp tục DS-001 waiting approval. OP UI/notifications vẫn task riêng. Repo main HEAD b207845, changes uncommitted; giữ scripts/op-write-test.mjs untracked và packages/op, không ghi OP. Chạy lại token docs/audit khi thay hệ thống, đọc UI-GUIDANCE hiện tại. Các checkpoints dưới là lịch sử, đã bị mục này thay thế khi mâu thuẫn.

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

## Cập nhật 12:50 (Claude) — OP-READ-001

- [OP-READ-001](tasks/OP-READ-001.md): lớp đọc OP chỉ GET (packages/op) + `dailyBreakdown` ở domain. Verified trong phạm vi test, chưa Accepted. check (41 test), build, e2e 8/8, desktop PASS lúc 12:48–12:49; đọc thật tháng 10 khớp 97h/16 entry, thiếu 12/10 = 8h.
- Chưa có: nối IPC/safeStorage/UI; nhãn 8/12/16 (P-03 Open); ngày thuộc diện tính (P-01 Open). Key không lưu trong repo (chỉ biến môi trường OP_API_KEY).
- Bước tiếp: owner chốt P-01/P-03; mở task nối main↔renderer.

## Cập nhật 13:00 (Claude) — owner trả lời
P-01 Confirmed (A). P-03: đề xuất tên nhãn trong POLICY-001, biên 12/16 vẫn Open. MASTER lên 0.10. Task tiếp theo: chờ owner polish UI/UX, chưa nối OP vào giao diện. Không đổi code.

## Cập nhật 13:10 (Claude)
Yêu cầu mới của owner: toàn bộ UI bằng tiếng Anh (MASTER 0.11). Chưa đổi chuỗi trong code (owner đang polish UI); thông báo lỗi packages/op cũng cần chuyển sang English khi nối vào UI.

## Cập nhật 13:05 (Claude) — UI/application toàn bộ English
Theo yêu cầu owner: đã chuyển mọi chuỗi hiển thị sang English (App, Drawer, DuplicateDialog, useWorkspace, demo data, lỗi packages/op, lỗi domain, locale en-US, html lang=en) và cập nhật e2e/smoke. Docs nội bộ giữ tiếng Việt. Kiểm tra 13:03: check 41/41, build, e2e 8/8, desktop PASS. Ngoài chuỗi chữ không đổi hành vi. Chưa có nhãn 8/12/16.

## Checkpoint mới nhất — Codex, 2026-10-12, UI-001

Task hiện tại [UI-001](tasks/UI-001.md) Verified local UI, chờ owner UAT. Owner yêu cầu polish trước khi tiếp tục tính năng. MASTER 0.12, AGENT-SPEC 0.12; UI-GUIDANCE chứa HeroUI v3 agent docs/patterns đã đọc. HeroUI Free/Tailwind đã cài và dùng thực tế; calendar custom, native dialog, Motion config giữ một nguồn.

Evidence mới: check 41/41, build, Chromium E2E 9/9, Electron Windows smoke PASS. Đã xem screenshots dashboard/drawer/duplicate/mobile. Chưa có macOS/performance budget/official accessibility audit. Preview 5173 được dùng lại từ server đang chạy; open_in_codex trả queued.

Repo hiện main HEAD b207845; UI/docs/dependencies/test changes đang uncommitted. Giữ nguyên untracked scripts/op-write-test.mjs của công việc trước, không chạy file đó trong UI-001. Không sửa packages/op hoặc ghi OP trong lượt. Nếu tiếp quản, đối soát git status trước sửa. Bước tiếp: owner xem UI polish, phản hồi visual; OP wiring vẫn ở task riêng.

## Checkpoint mới nhất — Codex, 2026-10-12, DS-001

Task [DS-001](tasks/DS-001.md) Verified local preview, chờ owner review. MASTER/AGENT-SPEC 0.13. User cho biên soạn token spec và tạo preview như HeroUI themes; không dùng lại approach polish.css nhiều component overrides.

Preview http://127.0.0.1:5173/design-system đã hiển thị trong in-app tab 4, markDeliverable. Native HeroUI component gallery + Dashboard + Foundations + Tokens, adjustable presets/profiles và export. CSS route isolated; audits và generated artifacts dưới docs/design-system. Root / vẫn workspace UI-001; chưa migrate.

Evidence: check 47/47 + artifact sync PASS, 15/15 Chromium E2E PASS, production build PASS, Electron Windows existing-workspace smoke PASS. Preview-only Electron smoke/macOS/full accessibility/performance budget NOT RUN. Stable screenshot tooltip in modal đã xem bổ sung; ảnh overview tại docs/design-system.

Files: packages/design-tokens/src/theme.ts/bds-source.json/component-inventory.json; apps/web/src/preview; WorkspaceEntry + main route; scripts/token-audit.ts/token-docs.ts. Commands tokens:audit, tokens:docs, tokens:check. Không duy trì bảng token thủ công thứ hai.

Git main HEAD b207845; UI-001/DS-001 docs/code/lockfile còn uncommitted. Preserve scripts/op-write-test.mjs untracked của công việc trước; không chạy nó hoặc sửa packages/op ở lượt này. Preview server 5173 dùng lại, không mở server trùng cổng.

Next: owner review preset/shape/spacing/color, rồi task migrate workspace. Defaults draft không tự xem là owner Accepted. JSON schema riêng bigin.design-tokens/v1, không giả vờ DTCG validated hoặc universal drop-in.
