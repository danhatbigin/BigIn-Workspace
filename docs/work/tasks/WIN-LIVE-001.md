# WIN-LIVE-001 — Windows pilot, API token và log time thật

Status: Verified Windows artifact + mock contract; chờ owner live UAT | Codex | 2026-10-12 | MASTER 0.15

Owner yêu cầu Windows app lần đầu nhập API token; xác nhận đọc và ghi log time thật. Server https://op.bigin.vn. Token do owner nhập trong app, không chèn vào repo/artifact. Không chạy op-write-test.mjs hoặc tự ghi production để test.

Scope: secure main/preload, encrypted token persistence, current-user entries + WP metadata/search, Add/Duplicate POST qua form/activity defaults, per-entry outcomes/uncertain protection, refresh/range và Windows x64 portable build. Web vẫn demo; WP creation/status chưa audit, live không giả lưu local.

## Kết quả

Main-only live adapter, safeStorage credential store + typed/sender-validated preload; first-run token form, current-user data, WP metadata/search, range load/Refresh/Forget token. Renderer transient input clear sau connect; no token read API/localStorage/cache mixing. Add/Duplicate async writes qua form/default activity, giữ pending/input/dismiss guards. Per-entry outcomes và durable write journal; failed retry riêng, unknown/sending chặn fingerprint cả restart. Không đóng modal khi retry success còn unknown rows.

WP creation/status và reminder chưa bật trong live pilot, UI nói rõ. Project-only logs read/aggregate nhưng không fake WP duplicate; HR calendar estimate annotated; partial data không kết luận completeness. Activity picker chưa có: default/form/source activity, thiếu default thì lỗi trước ghi. Search cap 100; batch cap 31. Unknown recovery UI chưa có, cần đối soát/hỗ trợ riêng.

Self-contained unsigned Windows x64 portable ZIP ở `release/BigIn-Workspace-0.2.0-win-x64.zip`, 159.050.068 bytes (~152 MiB). EXE ở folder cùng tên. Allowlist resources không include .env/userData/test scripts/token. SHA256: `C3C87E90CB42B9AEAEAE08B6C47F709ED5A486C7F932CD8935D0337C8907FFC8`.

## Evidence 2026-10-12

- `npm.cmd run check` PASS: typecheck, 53 tests (domain/read/write API/tokens), docs/token guard/artifact checks.
- `npm.cmd run test:e2e` 17/17 PASS: web demo/system regression sau async save. Selector modal được scope tên cụ thể để không nhầm dropdown đang exit.
- `npm.cmd run build:windows` PASS, Node main adapter bundle + web + ZIP; placeholder onboarding và single theme runtime là chỉnh cuối, build lại.
- `npm.cmd run test:desktop` PASS trên dev executable và **chính EXE release** (`BIGIN_PACKAGED_EXE`): mock localhost/fresh profile, wrong token 401; DPAPI encrypted at rest/no renderer storage; user=me + foreign exclusion; search/Add real POST contract; duplicate saved/403/response lost; retry only failed; unknown blocked after restart; Forget removes token; sandbox/contextIsolation true/nodeIntegration false; Light/Dark giữ đúng khi OS Reduce Motion đổi.
- Late live screenshot trên Electron hidden + emulated media timeout; bỏ ảnh tùy chọn này, giữ DOM/API assertions và ảnh first-run. Không suy từ lỗi capture thành lỗi API.
- First-run screenshot xem/copy `docs/design-system/windows-first-run.png`; ảnh/profile/mock không chứa token thật. Temporary profiles test được dọn theo resolved path guard.
- Build/test không kết nối hoặc ghi OP production; không chạy scripts/op-write-test.mjs. Mock verification không chứng minh contract/version/quyền BigIn.

## Handoff

MASTER/AGENT-SPEC 0.15, hướng dẫn `docs/WINDOWS-PILOT.md`, README/checkpoint cập nhật. Repo main HEAD b207845, changes chưa commit/push; giữ các changes DS trước và script op-write-test untracked. Next owner giải nén/mở EXE/nhập token/UAT, báo lỗi field/status khi xảy ra. Không yêu cầu token qua chat hoặc xóa journal để retry không đối soát. Web route vẫn demo. Signing/installer/macOS/performance và uncertainty recovery là tasks riêng.
