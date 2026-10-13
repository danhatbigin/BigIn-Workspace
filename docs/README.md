# BigIn Employee Workspace — Discovery

Ngày cập nhật: 2026-10-12. Trạng thái: local prototype BOOT-001 đã triển khai; PRD chi tiết tiếp tục discovery. Cách chạy tại [README dự án](../README.md).

Agent mới bắt đầu tại [START-HERE](../START-HERE.md), sau đó đọc [checkpoint hiện tại](work/CURRENT.md). [Workflow bàn giao](WORKFLOW.md) và [task template](work/TASK-TEMPLATE.md) phục vụ tiếp quản giữa các phiên/agent.

- [Master dành cho product owner](MASTER.md): nhu cầu, workflow, business rules, UX, visual/motion và câu hỏi mở.
- [Hướng dẫn tài liệu cho coding agent](AGENT-SPEC.md): cách chuyển yêu cầu thành công việc có thể kiểm chứng và giữ đồng bộ.
- [Motion registry và engine](MOTION-SPEC.md): presets, easing, duration, vị trí sử dụng và Reduce Motion; hiện là đề xuất trước implementation.

Nguồn: bản handoff v0.1 tại `D:/Downloads/BigIn_Employee_Workspace_Handoff.md` và input trực tiếp của owner ngày 2026-10-12. Input mới của owner được ưu tiên khi khác draft. Những work orders trong handoff không tự động là lệnh thực thi.

Quy ước: **Confirmed** = owner đã nói rõ; **Proposed** = đề xuất để thảo luận; **Open** = chưa đủ thông tin; **Verified** = đã kiểm chứng bằng bằng chứng phù hợp. Confirmed về nhu cầu không có nghĩa API đã Verified.

UI đã polish với HeroUI Free v3 + Tailwind v4. Xem [UI guidance](UI-GUIDANCE.md) để dùng đúng API, style imports và motion policy.

## DS-001 — Token specification / preview

[Mở Theme Preview](http://127.0.0.1:5173/design-system). [Design token draft](design-system/README.md) gồm nguồn BDS, token graph/mapping, profile defaults và giới hạn. Values/exports được generate từ source. Preview tách khỏi UI workspace cũ và có CSS audit.
