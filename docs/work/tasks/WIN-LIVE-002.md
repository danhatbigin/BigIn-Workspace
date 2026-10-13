# WIN-LIVE-002 — Sửa validation user khi log time

Status: Verified regression/mock contract, chờ owner live UAT | 2026-10-12 | MASTER 0.15 | Bugfix, không đổi business rule

Owner UAT Add/Duplicate: `OpenProject needs valid fields: user.` Code gửi user ID tường minh ở cả hai form requests/create. Audit trước đã ghi repo tham chiếu bỏ user khi log cho chính mình; mock ban đầu không kiểm user writable/default nên chưa cover contract này.

Scope: own-user form normalization, tránh gửi field user không writable, giữ xác minh entry thuộc tài khoản hiện tại, regression readonly/required/foreign-user và desktop mock; Windows release mới 0.2.1. Không lấy token owner/ghi production để test, không xóa journal.

Implemented: own-user create mặc định không gửi user trong cả form/create, để OP default theo auth. Chỉ thêm own user nếu form báo user thiếu và schema writable=true. Form user khác actor bị chặn; create response phải đúng user mới confirmed. Cùng adapter dùng cho Add/Duplicate. Validation detail message được đưa vào UI có redact key/auth và giới hạn độ dài, không echo response body. Lỗi validation xảy ra trước create POST và là known failure, không cần xóa journal/retry unknown.

Evidence: check/typecheck/domain/API/token guard PASS 56/56 (thêm readonly default, writable-required, foreign form/response). Desktop mock sửa để thực sự reject explicit readonly user; smoke trên EXE 0.2.1 cover Add/Duplicate + partial/uncertain/restart/credential security. Release mới release/BigIn-Workspace-0.2.1-win-x64.zip; bản 0.2.0 giữ lịch sử. UI không đổi nên không rerun toàn bộ Chromium suite khi không có failure mới. Không xác nhận instance BigIn đã ghi thành công; owner cần UAT mới.

Next: owner đóng app cũ, giải nén/mở 0.2.1, thử Add/Duplicate. Token store giữ cùng app identity. Nếu lỗi còn tồn tại, dùng message chi tiết mới để đối soát form/schema project cụ thể; không xin token qua chat. Repo uncommitted, preserve DS/WIN-LIVE changes và script op-write-test.mjs; không tự chạy production script.
