# UI guidance — shared HeroUI system

2026-10-12 | DS-002 | HeroUI Free 3.2.6 + Tailwind 4.3.3 | MASTER/AGENT-SPEC 0.14

## Policy đã chốt

Owner yêu cầu áp system đã review vào workspace, xóa legacy custom skins. Chỉ dùng system; component riêng phải compose từ HeroUI/system components. UI English; internal docs Việt. Không đổi log time/duplicate rules hoặc code OP.

## Nguồn chuẩn

- packages/design-tokens/src/theme.ts + bds-source.json: semantic tokens, profiles và bridge. Thay token ở đây; không viết palette tại feature.
- apps/web/src/system/useSystemTheme.ts: resolver/settings và OS Reduce Motion; hai routes dùng cùng hook/key, cross-tab storage sync. Entry data có key riêng.
- main.tsx import system/system.css duy nhất; CSS gồm Tailwind, stock HeroUI, Inter local và adapters disclosed.
- system/adapters.css: table stripe/hover/border; elevation; timing; warning surface bằng semantic variables. Không skin .button/.input/.card.
- WorkCalendar: stock ToggleButton + Chip + ProgressBar; date workflow từ domain. Root control chỉ thay layout qua utilities allowlisted, không màu/radius/hover/focus custom.
- ProjectSelect: stock Select + Label + ListBox; filtering/status nằm trong feature logic. Dùng public v3 API theo typings/docs version installed.
- Drawer, DuplicateDialog: feature compositions của stock Drawer/Modal/Form/TextField/Input/Card/Alert/Button. Dropdown native quản lý menu/focus. Save giữ validation/data logic và chỉ xác nhận sau persistence thành công.
- Motion package và wrappers cũ đã gỡ. Timing chung trong packages/ui/src/motion/motion.config.ts → token resolver → native CSS. Alert/Remove phản hồi trực tiếp; không tuyên bố có animation layout cũ. Conditional feature unmount có thể cắt stock exit; không dùng timer trì hoãn thao tác.

## Guard và kiểm chứng

Không tái tạo polish.css/tokens.css/styles.css/Dialog. Không Button className/style/render; dùng public variants primary/secondary/ghost, Link cho navigation. Layout bằng token utilities được phép. Không utility palette bypass tokens. Adapter mới phải disclosed và có source/role; không giấu skin dưới tên layout.

Sau sửa system CSS/JSX: tokens:audit. Sau sửa tokens/config: tokens:docs/motion:docs. check đối chiếu generated files. Static guard không thay review semantics/visual. Kiểm chứng Add/save/create/status/filter, duplicate blank/Remove/warning/back/cancel, storage failure, reduced motion, narrow viewport và Electron build. Chưa có macOS/full a11y/performance budget evidence.

## Tài liệu agent

HeroUI [React index](https://heroui.com/react/llms.txt), [theming](https://heroui.com/en/docs/react/getting-started/theming), [animation](https://heroui.com/en/docs/react/getting-started/animation), [official skill v3](https://raw.githubusercontent.com/heroui-inc/heroui/v3/skills/heroui-react/SKILL.md). Đọc trang component đang dùng, không load toàn bộ llms-full. Không dùng v2 Provider/APIs. MCP HeroUI chưa cấu hình; không tự cài global skill/generator. Không cần Pro cho các components đang dùng.
