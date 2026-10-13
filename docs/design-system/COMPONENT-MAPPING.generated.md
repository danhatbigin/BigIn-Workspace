# Component mapping — generated

## HeroUI bridge

| Family | Components | Tokens | Scope / limits |
|---|---|---|---|
| Actions | Button, Link | --accent / --default / --link | Primary, secondary, ghost and link. Link is a semantic component, not a fabricated Button variant. |
| Fields | Input, TextArea, TextField, Select | --field-* / --radius-field | BDS I2 fill, I3 border. Reference preset keeps stock HeroUI field surfaces. |
| Selection | Checkbox, RadioGroup, Switch, Tabs | --accent / --default / --segment | Native React Aria states and keyboard interaction. |
| Containers | Card, Surface | --surface / --surface-shadow | Elevation 1. Stock component geometry is controlled by the HeroUI radius scale. |
| Data | Table, Calendar, Chip, ProgressBar | --ds-table-stripe / --separator / status colors | Table stripe uses I1, independent semantic alias. Chart data uses categorical colors, not status colors. |
| Overlays | Select.Popover, Popover, Modal, Drawer, Tooltip | --overlay / --ds-elevation-2 / --ds-elevation-3 | One disclosed elevation adapter selects Level 2 versus Level 3; not a new visual skin. |
| Feedback | Alert, Spinner, Skeleton | --danger / --warning / --success | Status foreground and background are separate; reduced motion preserves information. |

## BDS source inventory

Structure scanned across all pages; not a runtime interaction audit. Component counts include variants.

### 0.0 — Example

1205 nodes · 0 component nodes.

No component set on this page; source examples or standalone components.

### 0.2 — Contains

4680 nodes · 42 component nodes.

- Drawer — 5 variants; axes: Floating, Minimized, Scrollable. Node 3249:51044.
- Section — 4 variants; axes: ╟ Filter, Footer, Substitution, Command bar, Body replacement, ╚ Search, Title, Type. Node 3178:32188.
- Modal — 11 variants; axes: Size, Scrollable, Dialog. Node 3245:41215.
- Header Drawer — 12 variants; axes: Title, Substitution, ╟ Filter, ╚ Search, Type, Collapse. Node 3291:43104.
- Footer — 5 variants; axes: 2 Actions, 3 Actions, Blank, ↔ Horizontal, ↕ Vertical. Node 3291:64693.
- Drawer — 3 variants; axes: Body replacement, Default, Floating, Minimized. Node 3150:30187.

### 1.0  —  Text editor

890 nodes · 8 component nodes.

- Toolbar — 2 variants; axes: Collapse. Node 3037:30426.
- Textbox — 2 variants; axes: Word count, Character count, Placeholder, Scalable, Value, Default, Input value. Node 3429:40406.
- Text editor — 4 variants; axes: Compact, Collapse. Node 3436:42287.

### 1.2 — Button

831 nodes · 216 component nodes.

- Combination 1.0 — 108 variants; axes: Icon, Button text, Type, Variants, Size, State, Icon position. Node 25:209.
- Icon only — 60 variants; axes: Icon, Type, Size, State. Node 726:9984.
- Combination 2.0 — 48 variants; axes: Icon R, Icon L, Icon Right, Icon Left, Button text, Type, Size, State. Node 1396:25886.

### 1.1 — 101 Fields

5798 nodes · 488 component nodes.

- Static 2.0 — 288 variants; axes: Placeholder, Label, Value, Label display, Default, Hover, Activated, Input value, Message, Error, Prefix, Suffix, Icon, Action, Prepend, Append. Node 7:52.
- Search — 8 variants; axes: Rep: Placeholder, Rep: Value, Page, Section, State. Node 173:1594.
- Floating label React — 78 variants; axes: Default, Hover, Activated, Input value, Error, Prefix, Suffix, Action, Icon, Helptext. Node 756:5835.
- Facial — 24 variants; axes: Rep: Value, Rep: Label, Rep: Placeholder, Icon, Type, State, Negative. Node 650:3337.
- Static 3.0 — 90 variants; axes: Placeholder, Label, Value, Label display, Message, Default, Hover, Activated, Input value, Error, Prefix, Suffix, Icon, Action, Prepend, Append. Node 1436:35997.

### 1.3 — Color picker

2194 nodes · 29 component nodes.

- Color Picker — 6 variants; axes: Solid, Icon, Small, Medium, Large. Node 708:4593.
- Colors Panel — 18 variants; axes: Color panel, Opacity, Magic triangle. Node 709:7885.
- Color — 4 variants; axes: More, Selected. Node 712:6440.

### 1.7 — Select

197 nodes · 4 component nodes.

- Selection group — 4 variants; axes: 3x2, 2x3, Single, Multiple. Node 516:3848.

### 2.0  — Display

238 nodes · 48 component nodes.

- Card view — 6 variants; axes: Title, Subtitle, Display icon, Display title, Display subtitle, Content, Small, Default, Hover, Pressed. Node 942:21440.
- Summary — 2 variants; axes: Rep: Subtitle, Rep: Title, Rep: Icon, Show icon, Hover. Node 988:21802.
- Stat — 4 variants; axes: Stat name, Number L, Change icon, Show icon, ⬆ Percentage, ⬇ Percentage, Criteria, Increased, Decreased, Tooltip, Number R, R Numbering, Group, Absolute Icon. Node 5030:3082.
- Avatar — 12 variants; axes: Avatar text, Swap-Icon2, Size, Rounded, Image, Icon. Node 1257:22693.
- Avatar 2.0 — 24 variants; axes: Avatar text, Xsmall, Small, Medium, Large, Round, Initials, Icon, Photo. Node 1801:33042.

### 2.1 — Data value

55 nodes · 5 component nodes.

- Value — 5 variants; axes: Label, Value, Closed, Open, Error, Warning, Pending, Processing, Success, Accent, Change icon, Default, Icon, Action, Tag, Status. Node 39:84.

### 2.2 — Data table

3277 nodes · 72 component nodes.

- Heading — 18 variants; axes: State, Sort, Divider, Splitter. Node 259:2124.
- Heading 2.0 — 18 variants; axes: Heading, State, Sort, Divider, Splitter. Node 5431:9480.
- Body — 16 variants; axes: Action 3, Action 2, T.Value, T.Substitution, Type, Background, Substitution. Node 260:1953.
- Body 2.0 — 16 variants; axes: Action 3, Action 2, T.Value, T.Substitution, Type, Background, Substitution. Node 5431:9565.
- Table — 2 variants; axes: Utilities. Node 438:2396.
- Table 2.0 — 2 variants; axes: Utilities. Node 5431:9628.

### 2.3 — Tag & Pill

21 nodes · 2 component nodes.

- Tag — 2 variants; axes: Value, Label, Icon, Show Icon, Closable, Filtering. Node 39:134.

### 2.4 — Data grid

13744 nodes · 174 component nodes.

- Data Grid / Heading — 51 variants; axes: |Left-|, |-Center-|, |-Right|, Splitter, Checkbox, Tools, Reorder, Tooltip calling, Wrap text, Null. Node 871:14877.
- Data Grid / Heading 2.0 — 11 variants; axes: Splitter, Reorder, Tool, |Left-|, |-Center-|, |-Right|, Checkbox, Tooltip calling, Wrap text, Null. Node 5432:17363.
- Data Grid / Body — 20 variants; axes: Value, |Left-|, |-Center-|, |-Right|, Currency, Left Unit, Subsituation, Image, Status, Action, Checkbox, Tools, Wrap text, Edit. Node 871:15696.
- Data Grid / Body 2.0 — 28 variants; axes: Value, Image, Substitution, |Left-|, |-Center-|, |-Right|, Currency, Left Unit, Status, Action, Checkbox, Tools, Wrap text, Edit, Background. Node 5432:17660.
- Grid — 10 variants; axes: Selection, Reorder, Group, Extendable. Node 889:16655.
- Grid 2.0 — 10 variants; axes: Selection, Reorder, Group, Extendable. Node 5432:17730.
- Column — 9 variants; axes: Checkbox, Number, Date, Name, Currency, Phone, Address, Status, Action. Node 901:34089.
- Column 2.0 — 9 variants; axes: Checkbox, Number, Date, Name, Currency, Phone, Address, Status, Action. Node 5432:17871.
- Row / Heading and Body — 12 variants; axes: Selection, Heading, Parents, Child, Child Grid, Extended Row. Node 901:38708.
- Row / Heading and Body — 12 variants; axes: Selection, Heading, Parents, Child, Child Grid, Extended Row. Node 5478:29286.
- Row / Heading and Body 2.0 — 2 variants; axes: Property 1. Node 5432:17980.

### 3.2 — Segment

150 nodes · 12 component nodes.

- Bar — 4 variants; axes: Small, Medium, Icon. Node 677:3804.
- Item — 8 variants; axes: Small, Medium, Icon, Activated. Node 953:24618.

### 3.3 — Tab

435 nodes · 32 component nodes.

- Items — 24 variants; axes: Inactive, Hover, Activated, Page, Section, Vertical, Icon. Node 136:355.
- Tab — 8 variants; axes: Page, Section, Vertical, Icon. Node 178:3142.

### 3.4 — Steps

292 nodes · 24 component nodes.

- Step Horizontal — 8 variants; axes: Text display, • Enable step name, • Enable description, Step name, Description, Loading, State. Node 626:3036.
- Step Vertical — 8 variants; axes: Titile, Subtitle, Type, State. Node 4456:976.
- Step circle — 3 variants; axes: Step, State. Node 630:3201.
- Step compact — 3 variants; axes: Step name, Descrption text, Description, Splitter, Step number, Activated, Done. Node 5616:122.

### 3.5 — Command bar

255 nodes · 10 component nodes.

- Command Bar — 10 variants; axes: Page, Section, Advanced, Search, Sidebar, More actions. Node 2880:29760.

### 3.6 — Menu

128 nodes · 23 component nodes.

- Toggle navigation — 3 variants; axes: State. Node 157:1564.
- Vertical — 8 variants; axes: Content, Action, Icon, Action2, Colapsed, Hovering, Activated. Node 436:2129.
- Nav Horizon — 12 variants; axes: Multiple, State, Icon. Node 440:4422.

### 3.7 — Pagination

146 nodes · 6 component nodes.

- Paging — 3 variants; axes: First, Middle, Last. Node 438:4352.
- Pagination — 3 variants; axes: First, Middle, Last. Node 438:4431.

### 5.0 — Chat UI

282 nodes · 6 component nodes.

- Gradient — 3 variants; axes: Property 1. Node 5044:32277.
- Sentro Logo — 2 variants; axes: Property 1. Node 5272:2576.

### 9.8 - Sandbox

4593 nodes · 15 component nodes.

- Column — 2 variants; axes: Property 1. Node 5272:2044.
- Heatbar — 11 variants; axes: Value, Percentage. Node 5313:7057.

### 9.9 — Supplementary

1487 nodes · 154 component nodes.

- Scroll bar — 6 variants; axes: Position, Vertical. Node 56:293.
- Radio — 4 variants; axes: State, Label. Node 502:3339.
- Message — 4 variants; axes: Content, Icon, Success, Hint, Warning, Error. Node 22:55.
- Magic triangle — 12 variants; axes: Vertical, Horizontal, Position. Node 53:4563.
- Input tools — 7 variants; axes: Pre|Suf, Pre|App, Swap-Icon, Swap-Flag, Prepend | Append, Prefix | Suffix, Flag, Search, Icon, Action. Node 48:4598.
- Checkbox — 5 variants; axes: Label, Text, State. Node 502:3292.
- Date time pickers/Date — 13 variants; axes: Pick, Today, Year, Days, Future past, Disable, Platform, Date Range. Node 658:4027.
- Left side — 5 variants; axes: Default, Hover, Error, Activated. Node 783:7419.
- Augmented — 6 variants; axes: Icon, Border, Action, Icon. Node 765:7564.
- Input border — 5 variants; axes: Default, Hover, Error, Activated. Node 783:7429.
- Label — 48 variants; axes: Label, Value, Default, Hover, Error, Input value, Activated, Prefix, Suffix, Icon, Action. Node 793:21997.
- Right side — 5 variants; axes: Default, Hover, Error, Activated. Node 783:7424.
- Breadcrumb — 2 variants; axes: Type. Node 264:1981.
- Date time pickers/Part — 4 variants; axes: Header, Footer, Clock, Date, Time. Node 805:15879.
- Date time pickers/Month — 2 variants; axes: Year activated. Node 816:18328.
- Loading — 4 variants; axes: Size, Before, After. Node 3148:30165.
- Skeleton — 4 variants; axes: Medium, Small, Central. Node 3164:30704.
- Loading / Parts — 9 variants; axes: Image, Title, Body, Step. Node 3223:32185.
- Loading / Primary — 4 variants; axes: Image, Title, Body, Size, Vertical. Node 3233:33011.

### 1.4 — Date time pickers

1283 nodes · 13 component nodes.

- Date — 7 variants; axes: Date, Month, Year, Action, Vue, React. Node 705:4799.
- Time — 6 variants; axes: AM, PM, Input, Vue, React. Node 705:5177.

### 1.5 — Transfer list

746 nodes · 4 component nodes.

- Basic usage — 2 variants; axes: Group layout, Section layout. Node 767:7773.
- Enhanced — 2 variants; axes: Group layout, Section layout. Node 767:8211.

### 1.6 — Select | Checkbox | Radio | Toggle

408 nodes · 32 component nodes.

- Toggle — 6 variants; axes: Turn it on, Label, Hint. Node 63:386.
- Selection list — 3 variants; axes: Single, Multiple, Select all. Node 63:904.
- Selection item — 22 variants; axes: Label, Subtitle text, Icon, Show sub, State, Checkbox, Text only, Indeterminate, Cardview, Cascader. Node 63:360.

### 2.5  — Listing

77 nodes · 5 component nodes.

- Grid view — 2 variants; axes: Checkbox display, Action display, Filename, Filesize, Description, More display, File icon, Hovering. Node 438:6757.
- Detail — 3 variants; axes: File size, File name, Description, File icon, Display description, Type. Node 446:3016.

### 3.0 — Navigation

728 nodes · 5 component nodes.

- Column — 2 variants; axes: Collapse. Node 440:8135.
- Bar — 2 variants; axes: Less, More. Node 955:27851.

### 3.1 — Topbar

561 nodes · 7 component nodes.

- Topbar — 7 variants; axes: Default, Navigation, Small, Medium, Breadcumb, Search, Call to action, More than 8 items. Node 440:4893.

### 4.0 — Responding

0 nodes · 0 component nodes.

No component set on this page; source examples or standalone components.

### 4.1 — Status & messages

203 nodes · 28 component nodes.

- Summary message — 12 variants; axes: Content, Replace icon, Close button, Type, Multiple line. Node 252:2099.
- Status — 14 variants; axes: Status, Contrast. Node 297:2309.
- Pill — 2 variants; axes: Status, Close button, Compact. Node 5082:49949.

### 4.2 — Tooltip

97 nodes · 12 component nodes.

- Tooltip — 12 variants; axes: Rep: Content, Position. Node 165:948.

### 3.8 — Background

32 nodes · 15 component nodes.

No component set on this page; source examples or standalone components.
