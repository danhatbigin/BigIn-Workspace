# BigIn × HeroUI — Design Tokens Draft

2026-10-12 | DS-002 | Trạng thái: owner đã yêu cầu áp system vào local workspace

Preview: `/design-system` trên web; `#design-system` trong Electron. Bốn views: Components, Dashboard, Foundations, Tokens. HeroUI Free 3.2.6, Tailwind 4.3.3, Inter local, Lucide hiện có. Không dùng code/template Pro.

## 1. Nguồn và điều đã chốt

- BDS Figma QKJIPbrT4AyjEwr3fXrNUU: quét cấu trúc 31 pages / 45.033 nodes / 98 component sets, đọc 90 variables, 63 paint styles, 46 text styles và 10 effect styles. bds-source.json là snapshot foundations; component-inventory.json ghi sets/axes theo page. Không đồng nghĩa đã test mọi interaction của component trong runtime.
- Owner: I1 canvas và table stripe; I2 textbox/selection hover; I3 border; I9 body; I6 placeholder. Tooltip Level 3; elevation 1/2/3 theo vai trò. Primary/secondary/ghost/link. Radius nested chỉ suy ra cho góc thực sự đồng tâm. Icons/typography default và các trục adjustable.
- HeroUI reference https://heroui.com/en/themes?base=0.0179&chroma=0&hue=0&lightness=0: đã mở trực tiếp và đọc computed variables Light/Dark. Neutral roles và black/white accent được giữ trong preset Neutral. Status/chart colors dùng BDS roles, không tuyên bố toàn bộ palette là bản sao pixel-perfect của website.

## 2. Kiến trúc và source of truth

`bds-source.json` (source primitives/modes/styles) → `theme.ts` (semantic roles + HeroUI bridge + profile rules) → workspace + preview + export + generated documentation.

- Primitive: palette/modes nguyên bản, typography/effect references, radius source.
- Semantic: canvas/surface/body/field/placeholder/selection/table/primary/status/chart.
- Component mapping: public HeroUI variables, giữ stock compound components và interaction states. BDS numeric radius không ép 1:1 vào mọi component nếu library dùng cùng radius scale. Đây là adapter constraint được công khai, không giấu trong selector CSS.
- Geometry: Sharp/Rounded/Circular là profile; `--radius` điều khiển stock HeroUI scale, `--field-radius` riêng cho form. Concentric sample có inner radius từ BDS và outer = inner + inset thật.
- Density: Comfortable/Compact là profile đề xuất, chưa owner duyệt thông số. Thay đổi --spacing ảnh hưởng padding/gap/size dùng scale HeroUI/Tailwind; các breakpoint/layout rem vẫn là cấu trúc trang.
- Typography: default Inter, fontScale 0.9–1.15 thay root size; hierarchy do library/semantic layout. BDS text styles lưu reference, không tự áp toàn bộ legacy typography.
- Motion: timing tham chiếu packages/ui/src/motion/motion.config.ts. CSS adapter chỉ timing; OS/data-reduce-motion xử lý motion-reduce của library. Không tự skin transform/shape của Button.

## 3. Các preset và điều chỉnh được

- HeroUI Neutral (default Dark): surfaces/body/field/neutral accent dựa trên computed values reference. Có Light.
- BDS Blue: values Appearance Light/Dark nguyên bản, primary #1E55EB; I2 fields, I1 stripe, I3 borders, I9 body.
- Custom accent: hue/chroma/lightness chỉ đổi accent trên Neutral, không giả vờ đã tạo lại toàn palette. Foreground heuristic cho custom accent cần review contrast; không bảo đảm WCAG cho mọi phối hợp tùy chỉnh.
- Radius, density, typography scale, Reduce Motion và placeholder contrast-safe có controls. Theme settings persist key bigin-design-preview-v1, dùng chung hai route và sync giữa tabs; không thay entry/task data.

## 4. Contrast: source versus proposal

I6/I2 source có ratio khoảng 3.85 Light, 4.31 Dark, chưa đạt 4.5 cho normal placeholder text. Contrast-safe mặc định bật và chọn I7 làm foreground trên field; source I6 không đổi. UI và registry ghi rõ adjustment. Status fill/soft/text được tách; không lấy màu sáng cấp 3 làm chữ trên màu nền cấp 1.

Đây là kiểm tra cặp token, chưa phải accessibility audit đầy đủ. Label/focus/validation và interaction do HeroUI/React Aria cung cấp; vẫn phải kiểm tra composition. BDS text colors lịch sử có khác I9, ưu tiên rule owner hiện tại.

## 5. Radius và elevation

Trong source: Corner M + padding 8 = Corner L ở Sharp 8+8=16, Rounded 12+8=20, Circular 16+8=24. Không áp công thức cho arbitrary parent–child, khoảng cách bất đối xứng, pill clamp hoặc corner smoothing. Border/padding/margin phải tính theo khoảng cách mép thực.

Level 1 = 0 4px 12px / black 4%; Level 2 = 1px 4px 16px / 8%; Level 3 = 2px 4px 16px / 12%. Đây là các shadow presets riêng, không cộng cả ba. Surface/shadow visibility trong Dark chưa được owner duyệt lại.

Card dùng surface-shadow Level 1. Overlay mặc định Level 2, Modal.Dialog/Drawer.Dialog/Tooltip.Content nhận class chỉ đổi --overlay-shadow sang Level 3. React Aria quản lý stacking; Tooltip và modal có thể cùng z-index 100000 nhưng portal/DOM order đặt tooltip phía trên. Không tự ép z-index 100 để phá library manager.

## 6. CSS và adapter disclosure

main.tsx import system/system.css một lần cho cả hai routes. polish.css, tokens.css, styles.css, native Dialog và preview/adapters.css cũ đã xóa.

- system/system.css: nhập Tailwind, HeroUI styles, Inter local và system/adapters.css. preview.css chỉ nhập layout.css của Lab. Workspace không có stylesheet skin riêng.
- layout.css: vị trí, grid, width, scroll, breakpoint, editorial typography của trang, đều dùng theme vars khi có màu. Không có .button/.input/.card skin selectors.
- system/adapters.css: 4 nhóm có chủ đích: warning surface semantic variables; table stripe/hover/border; elevation role variable; animation timing. Table stripe là adapter nhỏ vì stock Table chưa có semantic I1 alternate-row prop. Không gọi đây là zero CSS customization; phần tùy chỉnh đã được công khai.
- tokens:audit kiểm tra không có component skin selector hoặc literal colors trong custom application CSS/JSX, imports không nối legacy CSS, properties adapter phải thuộc allowlist. Không kiểm tra CSS shipped trong node_modules bằng cùng rule vì đó là implementation của library.
- Audit scope là workspace + preview: không Button presentation override, không native select/dialog, không palette utilities bypass semantic roles, không legacy files, không stylesheet mới chưa disclosed. Calendar compose ToggleButton/Chip/ProgressBar; root ToggleButton chỉ có allowlisted layout utilities. Đây là static guard, không thay visual/behavior review.

## 7. Export và generated artifacts

- [Token registry](TOKEN-REGISTRY.generated.md): values/aliases/CSS/source cho 4 preset/mode combinations.
- [Component mapping/inventory](COMPONENT-MAPPING.generated.md): bridge và danh mục component sets BDS.
- neutral-light/dark và bds-light/dark `.tokens.json` + `.css` được generate từ model.
- JSON dùng schema **bigin.design-tokens/v1**, lưu token name/type/value/alias/provenance/CSS bridge; không tự nhận DTCG-compliant hoặc drop-in cho mọi library. Có thể viết adapters khác từ semantic roles sau khi owner duyệt.
- CSS export nạp sau HeroUI, cần adapters.css nếu muốn đúng stripes/elevation của preview; typography scale được tiêu thụ bởi layout root. Đã áp vào local workspace; không gọi đây là production OP integration.

Commands: `npm run tokens:docs`, `npm run tokens:audit`, `npm run tokens:check`, `npm run check`. `tokens:check` kiểm tra audit report và generated artifact sync.

## 8. Coverage trong trang

Native Button/Link, Input/TextArea/TextField/Form/validation, Select/ListBox, Checkbox/RadioGroup/Switch, Tabs, Card/Avatar/Chip, Calendar, Table, ProgressBar/Spinner/Skeleton, Alert, Modal/Drawer/Tooltip và export dialog. Dashboard là composition tự xây từ các component đó, không copy paid template.

Chưa dựng mọi pattern BDS như transfer list, rich text editor, complex data grid, color picker và chat; chúng có trong source inventory để discovery/mapping tiếp. Owner đã chấp thuận bắt đầu áp system; các con số profile đề xuất vẫn có thể điều chỉnh.

