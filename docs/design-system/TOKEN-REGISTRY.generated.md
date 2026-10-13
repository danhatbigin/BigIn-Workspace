# Token registry — generated

Source: packages/design-tokens/src/theme.ts and bds-source.json. Draft, not owner-approved production tokens. Run npm run tokens:docs; do not maintain values manually.

## neutral / light

| Token | Value | Alias | CSS variable | Provenance |
|---|---|---|---|---|
| color.palette.neutral.canvas | oklch(97.02% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.body | oklch(21.03% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.surface | oklch(100% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.secondary | oklch(95.24% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.tertiary | oklch(93.73% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.default | oklch(94% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.muted | oklch(55.17% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.border | oklch(90% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.separator | oklch(92% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.accent | oklch(0 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.accentText | oklch(99.11% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.field | oklch(100% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.background.canvas | oklch(97.02% 0 0) | color.palette.neutral.canvas | --background | Semantic alias |
| color.text.primary | oklch(21.03% 0 0) | color.palette.neutral.body | --foreground | Semantic alias |
| color.surface.container | oklch(100% 0 0) | color.palette.neutral.surface | --surface | Semantic alias |
| color.surface.secondary | oklch(95.24% 0 0) | — | --surface-secondary | Preview proposal |
| color.surface.tertiary | oklch(93.73% 0 0) | — | --surface-tertiary | Preview proposal |
| color.surface.overlay | oklch(100% 0 0) | — | --overlay | Preview proposal |
| color.field.background | oklch(100% 0 0) | color.palette.neutral.field | --field-background | Semantic alias |
| color.field.foreground | oklch(21.03% 0 0) | color.text.primary | --field-foreground | Semantic alias |
| color.field.placeholder | oklch(55.17% 0 0) | color.palette.neutral.muted | --field-placeholder | Semantic alias |
| color.text.muted | oklch(55.17% 0 0) | color.palette.neutral.muted | --muted | Semantic alias |
| color.border.default | oklch(90% 0 0) | color.palette.neutral.border | --border | Semantic alias |
| color.border.field | oklch(90% 0 0) | color.border.default | --field-border | Semantic alias |
| color.separator.default | oklch(92% 0 0) | — | --separator | Preview proposal |
| color.selection.hover | oklch(94% 0 0) | — | --ds-selection-hover | Preview proposal |
| color.table.row.alternate | oklch(97.02% 0 0) | color.background.canvas | --ds-table-stripe | Semantic alias |
| color.action.primary | oklch(0 0 0) | — | --accent | Preview proposal |
| color.action.primary.foreground | oklch(99.11% 0 0) | — | --accent-foreground | Preview proposal |
| color.action.secondary | oklch(94% 0 0) | — | --default | Preview proposal |
| color.action.secondary.foreground | oklch(21.03% 0 0) | color.text.primary | --default-foreground | Semantic alias |
| color.action.link | oklch(0 0 0) | — | --link | Preview proposal |
| color.selection.active | oklch(100% 0 0) | — | --segment | Preview proposal |
| color.status.success.fill | #3ee089 | — | --success | Preview proposal |
| color.status.success.text-on-fill | #0a0a0b | — | --success-foreground | Preview proposal |
| color.status.success.soft | #eefcf4 | — | --success-soft | Preview proposal |
| color.status.success.soft-foreground | #0b4627 | — | --success-soft-foreground | Preview proposal |
| color.status.warning.fill | #ff871f | — | --warning | Preview proposal |
| color.status.warning.text-on-fill | #0a0a0b | — | --warning-foreground | Preview proposal |
| color.status.warning.soft | #fff4eb | — | --warning-soft | Preview proposal |
| color.status.warning.soft-foreground | #522000 | — | --warning-soft-foreground | Preview proposal |
| color.status.danger.fill | #ff1f1f | — | --danger | Preview proposal |
| color.status.danger.text-on-fill | #0a0a0b | — | --danger-foreground | Preview proposal |
| color.status.danger.soft | #ffebeb | — | --danger-soft | Preview proposal |
| color.status.danger.soft-foreground | #520000 | — | --danger-soft-foreground | Preview proposal |
| color.status.info.soft | #ebf3ff | — | --ds-info-soft | Preview proposal |
| color.status.info.foreground | #002152 | — | --ds-info-text | Preview proposal |
| color.chart.series.1 | #a268ff | — | --ds-chart-1 | Preview proposal |
| color.chart.series.2 | #ff7777 | — | --ds-chart-2 | Preview proposal |
| color.chart.series.3 | #ffcc68 | — | --ds-chart-3 | Preview proposal |
| color.chart.series.4 | #00c2ee | — | --ds-chart-4 | Preview proposal |
| color.chart.series.5 | #679bff | — | --ds-chart-5 | Preview proposal |
| color.chart.series.6 | #00ee98 | — | --ds-chart-6 | Preview proposal |
| color.chart.series.7 | #bac3cf | — | --ds-chart-7 | Preview proposal |
| color.chart.series.8 | #505d6f | — | --ds-chart-8 | Preview proposal |
| geometry.radius.nested-inner | 12 | — | --ds-radius-inner | BDS Radius/Rounded/Corner M |
| geometry.spacing.nested-inset | 8 | — | --ds-nested-inset | Preview density profile |
| geometry.radius.nested-outer | 20 | — | --ds-radius-outer | Derived: inner + inset |
| geometry.radius.heroui-base | 0.5rem | — | --radius | Preview HeroUI adapter |
| geometry.radius.field | 0.75rem | — | --field-radius | BDS Radius/Rounded/Corner M |
| geometry.spacing.unit | 0.25rem | — | --spacing | Preview density profile |
| spacing.scale.2 | 2 | — | --ds-space-2 | BDS observed values · scale proposal |
| spacing.scale.4 | 4 | — | --ds-space-4 | BDS observed values · scale proposal |
| spacing.scale.8 | 8 | — | --ds-space-8 | BDS observed values · scale proposal |
| spacing.scale.12 | 12 | — | --ds-space-12 | BDS observed values · scale proposal |
| spacing.scale.16 | 16 | — | --ds-space-16 | BDS observed values · scale proposal |
| spacing.scale.24 | 24 | — | --ds-space-24 | BDS observed values · scale proposal |
| spacing.scale.32 | 32 | — | --ds-space-32 | BDS observed values · scale proposal |
| spacing.scale.48 | 48 | — | --ds-space-48 | BDS observed values · scale proposal |
| elevation.level-1 | 0 4px 12px rgb(0 0 0 / 0.04) | — | --ds-elevation-1 | BDS effect style Level 1 |
| elevation.level-2 | 1px 4px 16px rgb(0 0 0 / 0.08) | — | --ds-elevation-2 | BDS effect style Level 2 |
| elevation.level-3 | 2px 4px 16px rgb(0 0 0 / 0.12) | — | --ds-elevation-3 | BDS effect style Level 3 |
| typography.family | Inter, ui-sans-serif, system-ui, sans-serif | — | --font-sans | HeroUI reference default; Inter also used in BDS |
| typography.scale | 1 | — | Reference only | Preview adjustable profile |
| typography.legacy.title.page | 32 | — | Reference only | BDS text style Title/Page |
| typography.legacy.title.section | 24 | — | Reference only | BDS text style Title/Section |
| typography.legacy.title.group | 18 | — | Reference only | BDS text style Title/Group |
| typography.legacy.subtitle.page | 24 | — | Reference only | BDS text style Subtitle/Page |
| typography.legacy.subtitle.section | 18 | — | Reference only | BDS text style Subtitle/Section |
| typography.legacy.subtitle.group | 14 | — | Reference only | BDS text style Subtitle/Group |
| typography.legacy.subtitle.body | 12 | — | Reference only | BDS text style Subtitle/Body |
| typography.legacy.button.large | 20 | — | Reference only | BDS text style Button/Large |
| typography.legacy.button.medium | 16 | — | Reference only | BDS text style Button/Medium |
| typography.legacy.button.small | 12 | — | Reference only | BDS text style Button/Small |
| typography.legacy.button.xsmall | 10 | — | Reference only | BDS text style Button/XSmall |
| typography.legacy.body.paragraph | 16 | — | Reference only | BDS text style Body/Paragraph |
| typography.legacy.body.tag | 14 | — | Reference only | BDS text style Body/Tag |
| typography.legacy.body.display.label | 12 | — | Reference only | BDS text style Body/Display/Label |
| typography.legacy.body.display.default | 16 | — | Reference only | BDS text style Body/Display/Default |
| typography.legacy.body.display.accent | 16 | — | Reference only | BDS text style Body/Display/Accent |
| typography.legacy.body.selection.default | 14 | — | Reference only | BDS text style Body/Selection/Default |
| typography.legacy.body.selection.hover | 14 | — | Reference only | BDS text style Body/Selection/Hover |
| typography.legacy.body.selection.selected | 14 | — | Reference only | BDS text style Body/Selection/Selected |
| typography.legacy.navigation.nav item | 14 | — | Reference only | BDS text style Navigation/Nav item |
| typography.legacy.system responding.validation | 12 | — | Reference only | BDS text style System responding/Validation |
| typography.legacy.system responding.tooltip | 14 | — | Reference only | BDS text style System responding/Tooltip |
| typography.legacy.system responding.summary mesage | 14 | — | Reference only | BDS text style System responding/Summary mesage |
| typography.legacy.system responding.status | 14 | — | Reference only | BDS text style System responding/Status |
| typography.legacy.date picker.today | 12 | — | Reference only | BDS text style Date picker/Today |
| typography.legacy.date picker.date.selected | 12 | — | Reference only | BDS text style Date picker/Date/Selected |
| typography.legacy.date picker.date.default | 12 | — | Reference only | BDS text style Date picker/Date/Default |
| typography.legacy.date picker.weekdays | 10 | — | Reference only | BDS text style Date picker/Weekdays |
| typography.legacy.navigation.tab item | 14 | — | Reference only | BDS text style Navigation/Tab item |
| typography.legacy.navigation.breadcrumb item | 10 | — | Reference only | BDS text style Navigation/Breadcrumb item |
| typography.legacy.title.extra.xtra light | 48 | — | Reference only | BDS text style Title/Extra/Xtra light |
| typography.legacy.title.extra.semibold | 48 | — | Reference only | BDS text style Title/Extra/Semibold |
| typography.legacy.data table.heading | 16 | — | Reference only | BDS text style Data table/Heading |
| typography.legacy.data table.value | 16 | — | Reference only | BDS text style Data table/Value |
| typography.legacy.data table.substitution | 12 | — | Reference only | BDS text style Data table/Substitution |
| typography.legacy.body.input.static.label | 12 | — | Reference only | BDS text style Body/Input/Static/Label |
| typography.legacy.body.input.static.value | 16 | — | Reference only | BDS text style Body/Input/Static/Value |
| typography.legacy.body.input.static.substitution | 16 | — | Reference only | BDS text style Body/Input/Static/Substitution |
| typography.legacy.body.input.facial.label | 14 | — | Reference only | BDS text style Body/Input/Facial/Label |
| typography.legacy.body.input.facial.value | 16 | — | Reference only | BDS text style Body/Input/Facial/Value |
| typography.legacy.body.input.facial.accent | 16 | — | Reference only | BDS text style Body/Input/Facial/Accent |
| typography.legacy.body.input.floating.value | 16 | — | Reference only | BDS text style Body/Input/Floating/Value |
| typography.legacy.body.input.floating.substitution | 14 | — | Reference only | BDS text style Body/Input/Floating/Substitution |
| typography.legacy.body.input.floating.label.default | 16 | — | Reference only | BDS text style Body/Input/Floating/Label/Default |
| typography.legacy.body.input.floating.label.accent | 12 | — | Reference only | BDS text style Body/Input/Floating/Label/Accent |
| typography.legacy.body.input.search.value | 12 | — | Reference only | BDS text style Body/Input/Search/Value |
| layer.tooltip.native | 100000 | — | Reference only | Observed React Aria overlay manager |
| motion.controls | 120ms | — | --ds-motion-control | Existing motion registry fast token |
| motion.panel | 260ms | — | --ds-motion-panel | Existing motion registry panel token |
| motion.ease-out | cubic-bezier(0, 0, 0.2, 1) | — | --ds-motion-ease | Existing motion registry easeOut token |

## neutral / dark

| Token | Value | Alias | CSS variable | Provenance |
|---|---|---|---|---|
| color.palette.neutral.canvas | oklch(12% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.body | oklch(99.11% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.surface | oklch(21.03% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.secondary | oklch(25.7% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.tertiary | oklch(27.21% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.default | oklch(27.4% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.muted | oklch(70.5% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.border | oklch(28% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.separator | oklch(25% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.accent | oklch(98.48% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.accentText | oklch(15% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.palette.neutral.field | oklch(21.03% 0 0) | — | Reference only | HeroUI Theme Builder reference · 2026-10-12 |
| color.background.canvas | oklch(12% 0 0) | color.palette.neutral.canvas | --background | Semantic alias |
| color.text.primary | oklch(99.11% 0 0) | color.palette.neutral.body | --foreground | Semantic alias |
| color.surface.container | oklch(21.03% 0 0) | color.palette.neutral.surface | --surface | Semantic alias |
| color.surface.secondary | oklch(25.7% 0 0) | — | --surface-secondary | Preview proposal |
| color.surface.tertiary | oklch(27.21% 0 0) | — | --surface-tertiary | Preview proposal |
| color.surface.overlay | oklch(21.03% 0 0) | — | --overlay | Preview proposal |
| color.field.background | oklch(21.03% 0 0) | color.palette.neutral.field | --field-background | Semantic alias |
| color.field.foreground | oklch(99.11% 0 0) | color.text.primary | --field-foreground | Semantic alias |
| color.field.placeholder | oklch(70.5% 0 0) | color.palette.neutral.muted | --field-placeholder | Semantic alias |
| color.text.muted | oklch(70.5% 0 0) | color.palette.neutral.muted | --muted | Semantic alias |
| color.border.default | oklch(28% 0 0) | color.palette.neutral.border | --border | Semantic alias |
| color.border.field | oklch(28% 0 0) | color.border.default | --field-border | Semantic alias |
| color.separator.default | oklch(25% 0 0) | — | --separator | Preview proposal |
| color.selection.hover | oklch(27.4% 0 0) | — | --ds-selection-hover | Preview proposal |
| color.table.row.alternate | oklch(12% 0 0) | color.background.canvas | --ds-table-stripe | Semantic alias |
| color.action.primary | oklch(98.48% 0 0) | — | --accent | Preview proposal |
| color.action.primary.foreground | oklch(15% 0 0) | — | --accent-foreground | Preview proposal |
| color.action.secondary | oklch(27.4% 0 0) | — | --default | Preview proposal |
| color.action.secondary.foreground | oklch(99.11% 0 0) | color.text.primary | --default-foreground | Semantic alias |
| color.action.link | oklch(98.48% 0 0) | — | --link | Preview proposal |
| color.selection.active | oklch(21.03% 0 0) | — | --segment | Preview proposal |
| color.status.success.fill | #3ee089 | — | --success | Preview proposal |
| color.status.success.text-on-fill | #0a0a0b | — | --success-foreground | Preview proposal |
| color.status.success.soft | #0b4627 | — | --success-soft | Preview proposal |
| color.status.success.soft-foreground | #eefcf4 | — | --success-soft-foreground | Preview proposal |
| color.status.warning.fill | #ff871f | — | --warning | Preview proposal |
| color.status.warning.text-on-fill | #0a0a0b | — | --warning-foreground | Preview proposal |
| color.status.warning.soft | #522000 | — | --warning-soft | Preview proposal |
| color.status.warning.soft-foreground | #fff4eb | — | --warning-soft-foreground | Preview proposal |
| color.status.danger.fill | #ff1f1f | — | --danger | Preview proposal |
| color.status.danger.text-on-fill | #0a0a0b | — | --danger-foreground | Preview proposal |
| color.status.danger.soft | #520000 | — | --danger-soft | Preview proposal |
| color.status.danger.soft-foreground | #ffebeb | — | --danger-soft-foreground | Preview proposal |
| color.status.info.soft | #002152 | — | --ds-info-soft | Preview proposal |
| color.status.info.foreground | #ebf3ff | — | --ds-info-text | Preview proposal |
| color.chart.series.1 | #a268ff | — | --ds-chart-1 | Preview proposal |
| color.chart.series.2 | #ff7777 | — | --ds-chart-2 | Preview proposal |
| color.chart.series.3 | #ffcc68 | — | --ds-chart-3 | Preview proposal |
| color.chart.series.4 | #00c2ee | — | --ds-chart-4 | Preview proposal |
| color.chart.series.5 | #679bff | — | --ds-chart-5 | Preview proposal |
| color.chart.series.6 | #00ee98 | — | --ds-chart-6 | Preview proposal |
| color.chart.series.7 | #bac3cf | — | --ds-chart-7 | Preview proposal |
| color.chart.series.8 | #505d6f | — | --ds-chart-8 | Preview proposal |
| geometry.radius.nested-inner | 12 | — | --ds-radius-inner | BDS Radius/Rounded/Corner M |
| geometry.spacing.nested-inset | 8 | — | --ds-nested-inset | Preview density profile |
| geometry.radius.nested-outer | 20 | — | --ds-radius-outer | Derived: inner + inset |
| geometry.radius.heroui-base | 0.5rem | — | --radius | Preview HeroUI adapter |
| geometry.radius.field | 0.75rem | — | --field-radius | BDS Radius/Rounded/Corner M |
| geometry.spacing.unit | 0.25rem | — | --spacing | Preview density profile |
| spacing.scale.2 | 2 | — | --ds-space-2 | BDS observed values · scale proposal |
| spacing.scale.4 | 4 | — | --ds-space-4 | BDS observed values · scale proposal |
| spacing.scale.8 | 8 | — | --ds-space-8 | BDS observed values · scale proposal |
| spacing.scale.12 | 12 | — | --ds-space-12 | BDS observed values · scale proposal |
| spacing.scale.16 | 16 | — | --ds-space-16 | BDS observed values · scale proposal |
| spacing.scale.24 | 24 | — | --ds-space-24 | BDS observed values · scale proposal |
| spacing.scale.32 | 32 | — | --ds-space-32 | BDS observed values · scale proposal |
| spacing.scale.48 | 48 | — | --ds-space-48 | BDS observed values · scale proposal |
| elevation.level-1 | 0 4px 12px rgb(0 0 0 / 0.04) | — | --ds-elevation-1 | BDS effect style Level 1 |
| elevation.level-2 | 1px 4px 16px rgb(0 0 0 / 0.08) | — | --ds-elevation-2 | BDS effect style Level 2 |
| elevation.level-3 | 2px 4px 16px rgb(0 0 0 / 0.12) | — | --ds-elevation-3 | BDS effect style Level 3 |
| typography.family | Inter, ui-sans-serif, system-ui, sans-serif | — | --font-sans | HeroUI reference default; Inter also used in BDS |
| typography.scale | 1 | — | Reference only | Preview adjustable profile |
| typography.legacy.title.page | 32 | — | Reference only | BDS text style Title/Page |
| typography.legacy.title.section | 24 | — | Reference only | BDS text style Title/Section |
| typography.legacy.title.group | 18 | — | Reference only | BDS text style Title/Group |
| typography.legacy.subtitle.page | 24 | — | Reference only | BDS text style Subtitle/Page |
| typography.legacy.subtitle.section | 18 | — | Reference only | BDS text style Subtitle/Section |
| typography.legacy.subtitle.group | 14 | — | Reference only | BDS text style Subtitle/Group |
| typography.legacy.subtitle.body | 12 | — | Reference only | BDS text style Subtitle/Body |
| typography.legacy.button.large | 20 | — | Reference only | BDS text style Button/Large |
| typography.legacy.button.medium | 16 | — | Reference only | BDS text style Button/Medium |
| typography.legacy.button.small | 12 | — | Reference only | BDS text style Button/Small |
| typography.legacy.button.xsmall | 10 | — | Reference only | BDS text style Button/XSmall |
| typography.legacy.body.paragraph | 16 | — | Reference only | BDS text style Body/Paragraph |
| typography.legacy.body.tag | 14 | — | Reference only | BDS text style Body/Tag |
| typography.legacy.body.display.label | 12 | — | Reference only | BDS text style Body/Display/Label |
| typography.legacy.body.display.default | 16 | — | Reference only | BDS text style Body/Display/Default |
| typography.legacy.body.display.accent | 16 | — | Reference only | BDS text style Body/Display/Accent |
| typography.legacy.body.selection.default | 14 | — | Reference only | BDS text style Body/Selection/Default |
| typography.legacy.body.selection.hover | 14 | — | Reference only | BDS text style Body/Selection/Hover |
| typography.legacy.body.selection.selected | 14 | — | Reference only | BDS text style Body/Selection/Selected |
| typography.legacy.navigation.nav item | 14 | — | Reference only | BDS text style Navigation/Nav item |
| typography.legacy.system responding.validation | 12 | — | Reference only | BDS text style System responding/Validation |
| typography.legacy.system responding.tooltip | 14 | — | Reference only | BDS text style System responding/Tooltip |
| typography.legacy.system responding.summary mesage | 14 | — | Reference only | BDS text style System responding/Summary mesage |
| typography.legacy.system responding.status | 14 | — | Reference only | BDS text style System responding/Status |
| typography.legacy.date picker.today | 12 | — | Reference only | BDS text style Date picker/Today |
| typography.legacy.date picker.date.selected | 12 | — | Reference only | BDS text style Date picker/Date/Selected |
| typography.legacy.date picker.date.default | 12 | — | Reference only | BDS text style Date picker/Date/Default |
| typography.legacy.date picker.weekdays | 10 | — | Reference only | BDS text style Date picker/Weekdays |
| typography.legacy.navigation.tab item | 14 | — | Reference only | BDS text style Navigation/Tab item |
| typography.legacy.navigation.breadcrumb item | 10 | — | Reference only | BDS text style Navigation/Breadcrumb item |
| typography.legacy.title.extra.xtra light | 48 | — | Reference only | BDS text style Title/Extra/Xtra light |
| typography.legacy.title.extra.semibold | 48 | — | Reference only | BDS text style Title/Extra/Semibold |
| typography.legacy.data table.heading | 16 | — | Reference only | BDS text style Data table/Heading |
| typography.legacy.data table.value | 16 | — | Reference only | BDS text style Data table/Value |
| typography.legacy.data table.substitution | 12 | — | Reference only | BDS text style Data table/Substitution |
| typography.legacy.body.input.static.label | 12 | — | Reference only | BDS text style Body/Input/Static/Label |
| typography.legacy.body.input.static.value | 16 | — | Reference only | BDS text style Body/Input/Static/Value |
| typography.legacy.body.input.static.substitution | 16 | — | Reference only | BDS text style Body/Input/Static/Substitution |
| typography.legacy.body.input.facial.label | 14 | — | Reference only | BDS text style Body/Input/Facial/Label |
| typography.legacy.body.input.facial.value | 16 | — | Reference only | BDS text style Body/Input/Facial/Value |
| typography.legacy.body.input.facial.accent | 16 | — | Reference only | BDS text style Body/Input/Facial/Accent |
| typography.legacy.body.input.floating.value | 16 | — | Reference only | BDS text style Body/Input/Floating/Value |
| typography.legacy.body.input.floating.substitution | 14 | — | Reference only | BDS text style Body/Input/Floating/Substitution |
| typography.legacy.body.input.floating.label.default | 16 | — | Reference only | BDS text style Body/Input/Floating/Label/Default |
| typography.legacy.body.input.floating.label.accent | 12 | — | Reference only | BDS text style Body/Input/Floating/Label/Accent |
| typography.legacy.body.input.search.value | 12 | — | Reference only | BDS text style Body/Input/Search/Value |
| layer.tooltip.native | 100000 | — | Reference only | Observed React Aria overlay manager |
| motion.controls | 120ms | — | --ds-motion-control | Existing motion registry fast token |
| motion.panel | 260ms | — | --ds-motion-panel | Existing motion registry panel token |
| motion.ease-out | cubic-bezier(0, 0, 0.2, 1) | — | --ds-motion-ease | Existing motion registry easeOut token |

## bds / light

| Token | Value | Alias | CSS variable | Provenance |
|---|---|---|---|---|
| color.palette.primary.primary1 | #d9e3fc | — | Reference only | BDS Appearance/Primary/Primary1/light |
| color.palette.primary.primary2 | #7c9cf4 | — | Reference only | BDS Appearance/Primary/Primary2/light |
| color.palette.primary.primary3 | #1e55eb | — | Reference only | BDS Appearance/Primary/Primary3/light |
| color.palette.primary.primary4 | #0d3296 | — | Reference only | BDS Appearance/Primary/Primary4/light |
| color.palette.primary.primary5 | #051338 | — | Reference only | BDS Appearance/Primary/Primary5/light |
| color.palette.interface.i1 | #f4f5f5 | — | Reference only | BDS Appearance/Interface/I1/light |
| color.palette.interface.i2 | #dfe0e2 | — | Reference only | BDS Appearance/Interface/I2/light |
| color.palette.interface.i3 | #babbbf | — | Reference only | BDS Appearance/Interface/I3/light |
| color.palette.interface.i4 | #a0a2a7 | — | Reference only | BDS Appearance/Interface/I4/light |
| color.palette.interface.i5 | #85888e | — | Reference only | BDS Appearance/Interface/I5/light |
| color.palette.interface.i6 | #6c6e75 | — | Reference only | BDS Appearance/Interface/I6/light |
| color.palette.interface.i7 | #53555a | — | Reference only | BDS Appearance/Interface/I7/light |
| color.palette.interface.i8 | #3b3c40 | — | Reference only | BDS Appearance/Interface/I8/light |
| color.palette.interface.i9 | #222325 | — | Reference only | BDS Appearance/Interface/I9/light |
| color.palette.interface.content | #0a0a0b | — | Reference only | BDS Appearance/Interface/Content/light |
| color.palette.interface.container | #fafafa | — | Reference only | BDS Appearance/Interface/Container/light |
| color.palette.elementary.red.r1 | #ffebeb | — | Reference only | BDS Appearance/Elementary/Red/R1/light |
| color.palette.elementary.red.r2 | #ff8585 | — | Reference only | BDS Appearance/Elementary/Red/R2/light |
| color.palette.elementary.red.r3 | #ff1f1f | — | Reference only | BDS Appearance/Elementary/Red/R3/light |
| color.palette.elementary.red.r4 | #b80000 | — | Reference only | BDS Appearance/Elementary/Red/R4/light |
| color.palette.elementary.red.r5 | #520000 | — | Reference only | BDS Appearance/Elementary/Red/R5/light |
| color.palette.elementary.blue.b1 | #ebf3ff | — | Reference only | BDS Appearance/Elementary/Blue/B1/light |
| color.palette.elementary.blue.b2 | #85b6ff | — | Reference only | BDS Appearance/Elementary/Blue/B2/light |
| color.palette.elementary.blue.b3 | #1f78ff | — | Reference only | BDS Appearance/Elementary/Blue/B3/light |
| color.palette.elementary.blue.b4 | #0049b8 | — | Reference only | BDS Appearance/Elementary/Blue/B4/light |
| color.palette.elementary.blue.b5 | #002152 | — | Reference only | BDS Appearance/Elementary/Blue/B5/light |
| color.palette.elementary.green.g1 | #eefcf4 | — | Reference only | BDS Appearance/Elementary/Green/G1/light |
| color.palette.elementary.green.g2 | #96eebf | — | Reference only | BDS Appearance/Elementary/Green/G2/light |
| color.palette.elementary.green.g3 | #3ee089 | — | Reference only | BDS Appearance/Elementary/Green/G3/light |
| color.palette.elementary.green.g4 | #1a9e57 | — | Reference only | BDS Appearance/Elementary/Green/G4/light |
| color.palette.elementary.green.g5 | #0b4627 | — | Reference only | BDS Appearance/Elementary/Green/G5/light |
| color.palette.elementary.orange.o1 | #fff4eb | — | Reference only | BDS Appearance/Elementary/Orange/O1/light |
| color.palette.elementary.orange.o2 | #ffbd85 | — | Reference only | BDS Appearance/Elementary/Orange/O2/light |
| color.palette.elementary.orange.o3 | #ff871f | — | Reference only | BDS Appearance/Elementary/Orange/O3/light |
| color.palette.elementary.orange.o4 | #b85600 | — | Reference only | BDS Appearance/Elementary/Orange/O4/light |
| color.palette.elementary.orange.o5 | #522000 | — | Reference only | BDS Appearance/Elementary/Orange/O5/light |
| color.palette.elementary.teal.t1 | #edfafd | — | Reference only | BDS Appearance/Elementary/Teal/T1/light |
| color.palette.elementary.teal.t2 | #93e4f0 | — | Reference only | BDS Appearance/Elementary/Teal/T2/light |
| color.palette.elementary.teal.t3 | #3acde4 | — | Reference only | BDS Appearance/Elementary/Teal/T3/light |
| color.palette.elementary.teal.t4 | #168fa2 | — | Reference only | BDS Appearance/Elementary/Teal/T4/light |
| color.palette.elementary.teal.t5 | #0a4048 | — | Reference only | BDS Appearance/Elementary/Teal/T5/light |
| color.palette.elementary.yellow.y1 | #fffaeb | — | Reference only | BDS Appearance/Elementary/Yellow/Y1/light |
| color.palette.elementary.yellow.y2 | #ffde85 | — | Reference only | BDS Appearance/Elementary/Yellow/Y2/light |
| color.palette.elementary.yellow.y3 | #ffc31f | — | Reference only | BDS Appearance/Elementary/Yellow/Y3/light |
| color.palette.elementary.yellow.y4 | #b88600 | — | Reference only | BDS Appearance/Elementary/Yellow/Y4/light |
| color.palette.elementary.yellow.y5 | #523c00 | — | Reference only | BDS Appearance/Elementary/Yellow/Y5/light |
| color.palette.chart.1 | #a268ff | — | Reference only | BDS Appearance/Chart/1/light |
| color.palette.chart.2 | #ff7777 | — | Reference only | BDS Appearance/Chart/2/light |
| color.palette.chart.3 | #ffcc68 | — | Reference only | BDS Appearance/Chart/3/light |
| color.palette.chart.4 | #00c2ee | — | Reference only | BDS Appearance/Chart/4/light |
| color.palette.chart.5 | #679bff | — | Reference only | BDS Appearance/Chart/5/light |
| color.palette.chart.6 | #00ee98 | — | Reference only | BDS Appearance/Chart/6/light |
| color.palette.chart.7 | #bac3cf | — | Reference only | BDS Appearance/Chart/7/light |
| color.palette.chart.8 | #505d6f | — | Reference only | BDS Appearance/Chart/8/light |
| color.palette.interface.absolute-white | #ffffff | — | Reference only | BDS Appearance/Interface/Absolute White/light |
| color.palette.table.neutral-bg | #f4f4f4 | — | Reference only | BDS Appearance/Table/Neutral BG/light |
| color.background.canvas | #f4f5f5 | color.palette.interface.i1 | --background | Semantic alias |
| color.text.primary | #222325 | color.palette.interface.i9 | --foreground | Semantic alias |
| color.surface.container | #fafafa | color.palette.interface.container | --surface | Semantic alias |
| color.surface.secondary | #f4f5f5 | — | --surface-secondary | Preview proposal |
| color.surface.tertiary | #dfe0e2 | — | --surface-tertiary | Preview proposal |
| color.surface.overlay | #fafafa | — | --overlay | Preview proposal |
| color.field.background | #dfe0e2 | color.palette.interface.i2 | --field-background | Semantic alias |
| color.field.foreground | #222325 | color.text.primary | --field-foreground | Semantic alias |
| color.field.placeholder | #53555a | color.palette.interface.i7 | --field-placeholder | Semantic alias |
| color.text.muted | #6c6e75 | color.palette.interface.i6 | --muted | Semantic alias |
| color.border.default | #babbbf | color.palette.interface.i3 | --border | Semantic alias |
| color.border.field | #babbbf | color.border.default | --field-border | Semantic alias |
| color.separator.default | #babbbf | — | --separator | Preview proposal |
| color.selection.hover | #dfe0e2 | — | --ds-selection-hover | Preview proposal |
| color.table.row.alternate | #f4f5f5 | color.background.canvas | --ds-table-stripe | Semantic alias |
| color.action.primary | #1e55eb | — | --accent | Preview proposal |
| color.action.primary.foreground | #ffffff | — | --accent-foreground | Preview proposal |
| color.action.secondary | #dfe0e2 | — | --default | Preview proposal |
| color.action.secondary.foreground | #222325 | color.text.primary | --default-foreground | Semantic alias |
| color.action.link | #1e55eb | — | --link | Preview proposal |
| color.selection.active | #fafafa | — | --segment | Preview proposal |
| color.status.success.fill | #3ee089 | — | --success | Preview proposal |
| color.status.success.text-on-fill | #0a0a0b | — | --success-foreground | Preview proposal |
| color.status.success.soft | #eefcf4 | — | --success-soft | Preview proposal |
| color.status.success.soft-foreground | #0b4627 | — | --success-soft-foreground | Preview proposal |
| color.status.warning.fill | #ff871f | — | --warning | Preview proposal |
| color.status.warning.text-on-fill | #0a0a0b | — | --warning-foreground | Preview proposal |
| color.status.warning.soft | #fff4eb | — | --warning-soft | Preview proposal |
| color.status.warning.soft-foreground | #522000 | — | --warning-soft-foreground | Preview proposal |
| color.status.danger.fill | #ff1f1f | — | --danger | Preview proposal |
| color.status.danger.text-on-fill | #0a0a0b | — | --danger-foreground | Preview proposal |
| color.status.danger.soft | #ffebeb | — | --danger-soft | Preview proposal |
| color.status.danger.soft-foreground | #520000 | — | --danger-soft-foreground | Preview proposal |
| color.status.info.soft | #ebf3ff | — | --ds-info-soft | Preview proposal |
| color.status.info.foreground | #002152 | — | --ds-info-text | Preview proposal |
| color.chart.series.1 | #a268ff | — | --ds-chart-1 | Preview proposal |
| color.chart.series.2 | #ff7777 | — | --ds-chart-2 | Preview proposal |
| color.chart.series.3 | #ffcc68 | — | --ds-chart-3 | Preview proposal |
| color.chart.series.4 | #00c2ee | — | --ds-chart-4 | Preview proposal |
| color.chart.series.5 | #679bff | — | --ds-chart-5 | Preview proposal |
| color.chart.series.6 | #00ee98 | — | --ds-chart-6 | Preview proposal |
| color.chart.series.7 | #bac3cf | — | --ds-chart-7 | Preview proposal |
| color.chart.series.8 | #505d6f | — | --ds-chart-8 | Preview proposal |
| geometry.radius.nested-inner | 12 | — | --ds-radius-inner | BDS Radius/Rounded/Corner M |
| geometry.spacing.nested-inset | 8 | — | --ds-nested-inset | Preview density profile |
| geometry.radius.nested-outer | 20 | — | --ds-radius-outer | Derived: inner + inset |
| geometry.radius.heroui-base | 0.5rem | — | --radius | Preview HeroUI adapter |
| geometry.radius.field | 0.75rem | — | --field-radius | BDS Radius/Rounded/Corner M |
| geometry.spacing.unit | 0.25rem | — | --spacing | Preview density profile |
| spacing.scale.2 | 2 | — | --ds-space-2 | BDS observed values · scale proposal |
| spacing.scale.4 | 4 | — | --ds-space-4 | BDS observed values · scale proposal |
| spacing.scale.8 | 8 | — | --ds-space-8 | BDS observed values · scale proposal |
| spacing.scale.12 | 12 | — | --ds-space-12 | BDS observed values · scale proposal |
| spacing.scale.16 | 16 | — | --ds-space-16 | BDS observed values · scale proposal |
| spacing.scale.24 | 24 | — | --ds-space-24 | BDS observed values · scale proposal |
| spacing.scale.32 | 32 | — | --ds-space-32 | BDS observed values · scale proposal |
| spacing.scale.48 | 48 | — | --ds-space-48 | BDS observed values · scale proposal |
| elevation.level-1 | 0 4px 12px rgb(0 0 0 / 0.04) | — | --ds-elevation-1 | BDS effect style Level 1 |
| elevation.level-2 | 1px 4px 16px rgb(0 0 0 / 0.08) | — | --ds-elevation-2 | BDS effect style Level 2 |
| elevation.level-3 | 2px 4px 16px rgb(0 0 0 / 0.12) | — | --ds-elevation-3 | BDS effect style Level 3 |
| typography.family | Inter, ui-sans-serif, system-ui, sans-serif | — | --font-sans | HeroUI reference default; Inter also used in BDS |
| typography.scale | 1 | — | Reference only | Preview adjustable profile |
| typography.legacy.title.page | 32 | — | Reference only | BDS text style Title/Page |
| typography.legacy.title.section | 24 | — | Reference only | BDS text style Title/Section |
| typography.legacy.title.group | 18 | — | Reference only | BDS text style Title/Group |
| typography.legacy.subtitle.page | 24 | — | Reference only | BDS text style Subtitle/Page |
| typography.legacy.subtitle.section | 18 | — | Reference only | BDS text style Subtitle/Section |
| typography.legacy.subtitle.group | 14 | — | Reference only | BDS text style Subtitle/Group |
| typography.legacy.subtitle.body | 12 | — | Reference only | BDS text style Subtitle/Body |
| typography.legacy.button.large | 20 | — | Reference only | BDS text style Button/Large |
| typography.legacy.button.medium | 16 | — | Reference only | BDS text style Button/Medium |
| typography.legacy.button.small | 12 | — | Reference only | BDS text style Button/Small |
| typography.legacy.button.xsmall | 10 | — | Reference only | BDS text style Button/XSmall |
| typography.legacy.body.paragraph | 16 | — | Reference only | BDS text style Body/Paragraph |
| typography.legacy.body.tag | 14 | — | Reference only | BDS text style Body/Tag |
| typography.legacy.body.display.label | 12 | — | Reference only | BDS text style Body/Display/Label |
| typography.legacy.body.display.default | 16 | — | Reference only | BDS text style Body/Display/Default |
| typography.legacy.body.display.accent | 16 | — | Reference only | BDS text style Body/Display/Accent |
| typography.legacy.body.selection.default | 14 | — | Reference only | BDS text style Body/Selection/Default |
| typography.legacy.body.selection.hover | 14 | — | Reference only | BDS text style Body/Selection/Hover |
| typography.legacy.body.selection.selected | 14 | — | Reference only | BDS text style Body/Selection/Selected |
| typography.legacy.navigation.nav item | 14 | — | Reference only | BDS text style Navigation/Nav item |
| typography.legacy.system responding.validation | 12 | — | Reference only | BDS text style System responding/Validation |
| typography.legacy.system responding.tooltip | 14 | — | Reference only | BDS text style System responding/Tooltip |
| typography.legacy.system responding.summary mesage | 14 | — | Reference only | BDS text style System responding/Summary mesage |
| typography.legacy.system responding.status | 14 | — | Reference only | BDS text style System responding/Status |
| typography.legacy.date picker.today | 12 | — | Reference only | BDS text style Date picker/Today |
| typography.legacy.date picker.date.selected | 12 | — | Reference only | BDS text style Date picker/Date/Selected |
| typography.legacy.date picker.date.default | 12 | — | Reference only | BDS text style Date picker/Date/Default |
| typography.legacy.date picker.weekdays | 10 | — | Reference only | BDS text style Date picker/Weekdays |
| typography.legacy.navigation.tab item | 14 | — | Reference only | BDS text style Navigation/Tab item |
| typography.legacy.navigation.breadcrumb item | 10 | — | Reference only | BDS text style Navigation/Breadcrumb item |
| typography.legacy.title.extra.xtra light | 48 | — | Reference only | BDS text style Title/Extra/Xtra light |
| typography.legacy.title.extra.semibold | 48 | — | Reference only | BDS text style Title/Extra/Semibold |
| typography.legacy.data table.heading | 16 | — | Reference only | BDS text style Data table/Heading |
| typography.legacy.data table.value | 16 | — | Reference only | BDS text style Data table/Value |
| typography.legacy.data table.substitution | 12 | — | Reference only | BDS text style Data table/Substitution |
| typography.legacy.body.input.static.label | 12 | — | Reference only | BDS text style Body/Input/Static/Label |
| typography.legacy.body.input.static.value | 16 | — | Reference only | BDS text style Body/Input/Static/Value |
| typography.legacy.body.input.static.substitution | 16 | — | Reference only | BDS text style Body/Input/Static/Substitution |
| typography.legacy.body.input.facial.label | 14 | — | Reference only | BDS text style Body/Input/Facial/Label |
| typography.legacy.body.input.facial.value | 16 | — | Reference only | BDS text style Body/Input/Facial/Value |
| typography.legacy.body.input.facial.accent | 16 | — | Reference only | BDS text style Body/Input/Facial/Accent |
| typography.legacy.body.input.floating.value | 16 | — | Reference only | BDS text style Body/Input/Floating/Value |
| typography.legacy.body.input.floating.substitution | 14 | — | Reference only | BDS text style Body/Input/Floating/Substitution |
| typography.legacy.body.input.floating.label.default | 16 | — | Reference only | BDS text style Body/Input/Floating/Label/Default |
| typography.legacy.body.input.floating.label.accent | 12 | — | Reference only | BDS text style Body/Input/Floating/Label/Accent |
| typography.legacy.body.input.search.value | 12 | — | Reference only | BDS text style Body/Input/Search/Value |
| layer.tooltip.native | 100000 | — | Reference only | Observed React Aria overlay manager |
| motion.controls | 120ms | — | --ds-motion-control | Existing motion registry fast token |
| motion.panel | 260ms | — | --ds-motion-panel | Existing motion registry panel token |
| motion.ease-out | cubic-bezier(0, 0, 0.2, 1) | — | --ds-motion-ease | Existing motion registry easeOut token |

## bds / dark

| Token | Value | Alias | CSS variable | Provenance |
|---|---|---|---|---|
| color.palette.primary.primary1 | #051338 | — | Reference only | BDS Appearance/Primary/Primary1/dark |
| color.palette.primary.primary2 | #0d3296 | — | Reference only | BDS Appearance/Primary/Primary2/dark |
| color.palette.primary.primary3 | #1e55eb | — | Reference only | BDS Appearance/Primary/Primary3/dark |
| color.palette.primary.primary4 | #7c9cf4 | — | Reference only | BDS Appearance/Primary/Primary4/dark |
| color.palette.primary.primary5 | #d9e3fc | — | Reference only | BDS Appearance/Primary/Primary5/dark |
| color.palette.interface.i1 | #222325 | — | Reference only | BDS Appearance/Interface/I1/dark |
| color.palette.interface.i2 | #3b3c40 | — | Reference only | BDS Appearance/Interface/I2/dark |
| color.palette.interface.i3 | #53555a | — | Reference only | BDS Appearance/Interface/I3/dark |
| color.palette.interface.i4 | #6c6e75 | — | Reference only | BDS Appearance/Interface/I4/dark |
| color.palette.interface.i5 | #85878e | — | Reference only | BDS Appearance/Interface/I5/dark |
| color.palette.interface.i6 | #a0a2a7 | — | Reference only | BDS Appearance/Interface/I6/dark |
| color.palette.interface.i7 | #babbbf | — | Reference only | BDS Appearance/Interface/I7/dark |
| color.palette.interface.i8 | #d5d6d8 | — | Reference only | BDS Appearance/Interface/I8/dark |
| color.palette.interface.i9 | #f4f5f5 | — | Reference only | BDS Appearance/Interface/I9/dark |
| color.palette.interface.content | #ffffff | — | Reference only | BDS Appearance/Interface/Content/dark |
| color.palette.interface.container | #050505 | — | Reference only | BDS Appearance/Interface/Container/dark |
| color.palette.elementary.red.r1 | #520000 | — | Reference only | BDS Appearance/Elementary/Red/R1/dark |
| color.palette.elementary.red.r2 | #b80000 | — | Reference only | BDS Appearance/Elementary/Red/R2/dark |
| color.palette.elementary.red.r3 | #ff1f1f | — | Reference only | BDS Appearance/Elementary/Red/R3/dark |
| color.palette.elementary.red.r4 | #ff8585 | — | Reference only | BDS Appearance/Elementary/Red/R4/dark |
| color.palette.elementary.red.r5 | #ffebeb | — | Reference only | BDS Appearance/Elementary/Red/R5/dark |
| color.palette.elementary.blue.b1 | #002152 | — | Reference only | BDS Appearance/Elementary/Blue/B1/dark |
| color.palette.elementary.blue.b2 | #0049b8 | — | Reference only | BDS Appearance/Elementary/Blue/B2/dark |
| color.palette.elementary.blue.b3 | #1f78ff | — | Reference only | BDS Appearance/Elementary/Blue/B3/dark |
| color.palette.elementary.blue.b4 | #85b6ff | — | Reference only | BDS Appearance/Elementary/Blue/B4/dark |
| color.palette.elementary.blue.b5 | #ebf3ff | — | Reference only | BDS Appearance/Elementary/Blue/B5/dark |
| color.palette.elementary.green.g1 | #0b4627 | — | Reference only | BDS Appearance/Elementary/Green/G1/dark |
| color.palette.elementary.green.g2 | #1a9e57 | — | Reference only | BDS Appearance/Elementary/Green/G2/dark |
| color.palette.elementary.green.g3 | #3ee089 | — | Reference only | BDS Appearance/Elementary/Green/G3/dark |
| color.palette.elementary.green.g4 | #96eebf | — | Reference only | BDS Appearance/Elementary/Green/G4/dark |
| color.palette.elementary.green.g5 | #eefcf4 | — | Reference only | BDS Appearance/Elementary/Green/G5/dark |
| color.palette.elementary.orange.o1 | #522000 | — | Reference only | BDS Appearance/Elementary/Orange/O1/dark |
| color.palette.elementary.orange.o2 | #b85600 | — | Reference only | BDS Appearance/Elementary/Orange/O2/dark |
| color.palette.elementary.orange.o3 | #ff871f | — | Reference only | BDS Appearance/Elementary/Orange/O3/dark |
| color.palette.elementary.orange.o4 | #ffbd85 | — | Reference only | BDS Appearance/Elementary/Orange/O4/dark |
| color.palette.elementary.orange.o5 | #fff4eb | — | Reference only | BDS Appearance/Elementary/Orange/O5/dark |
| color.palette.elementary.teal.t1 | #0a4048 | — | Reference only | BDS Appearance/Elementary/Teal/T1/dark |
| color.palette.elementary.teal.t2 | #168fa2 | — | Reference only | BDS Appearance/Elementary/Teal/T2/dark |
| color.palette.elementary.teal.t3 | #3acde4 | — | Reference only | BDS Appearance/Elementary/Teal/T3/dark |
| color.palette.elementary.teal.t4 | #93e4f0 | — | Reference only | BDS Appearance/Elementary/Teal/T4/dark |
| color.palette.elementary.teal.t5 | #edfafd | — | Reference only | BDS Appearance/Elementary/Teal/T5/dark |
| color.palette.elementary.yellow.y1 | #523c00 | — | Reference only | BDS Appearance/Elementary/Yellow/Y1/dark |
| color.palette.elementary.yellow.y2 | #b88600 | — | Reference only | BDS Appearance/Elementary/Yellow/Y2/dark |
| color.palette.elementary.yellow.y3 | #ffc31f | — | Reference only | BDS Appearance/Elementary/Yellow/Y3/dark |
| color.palette.elementary.yellow.y4 | #ffde85 | — | Reference only | BDS Appearance/Elementary/Yellow/Y4/dark |
| color.palette.elementary.yellow.y5 | #fffaeb | — | Reference only | BDS Appearance/Elementary/Yellow/Y5/dark |
| color.palette.chart.1 | #a268ff | — | Reference only | BDS Appearance/Chart/1/dark |
| color.palette.chart.2 | #ff7777 | — | Reference only | BDS Appearance/Chart/2/dark |
| color.palette.chart.3 | #ffcc68 | — | Reference only | BDS Appearance/Chart/3/dark |
| color.palette.chart.4 | #00c2ee | — | Reference only | BDS Appearance/Chart/4/dark |
| color.palette.chart.5 | #679bff | — | Reference only | BDS Appearance/Chart/5/dark |
| color.palette.chart.6 | #00ee98 | — | Reference only | BDS Appearance/Chart/6/dark |
| color.palette.chart.7 | #bac3cf | — | Reference only | BDS Appearance/Chart/7/dark |
| color.palette.chart.8 | #505d6f | — | Reference only | BDS Appearance/Chart/8/dark |
| color.palette.interface.absolute-white | #ffffff | — | Reference only | BDS Appearance/Interface/Absolute White/dark |
| color.palette.table.neutral-bg | #161616 | — | Reference only | BDS Appearance/Table/Neutral BG/dark |
| color.background.canvas | #222325 | color.palette.interface.i1 | --background | Semantic alias |
| color.text.primary | #f4f5f5 | color.palette.interface.i9 | --foreground | Semantic alias |
| color.surface.container | #050505 | color.palette.interface.container | --surface | Semantic alias |
| color.surface.secondary | #222325 | — | --surface-secondary | Preview proposal |
| color.surface.tertiary | #3b3c40 | — | --surface-tertiary | Preview proposal |
| color.surface.overlay | #050505 | — | --overlay | Preview proposal |
| color.field.background | #3b3c40 | color.palette.interface.i2 | --field-background | Semantic alias |
| color.field.foreground | #f4f5f5 | color.text.primary | --field-foreground | Semantic alias |
| color.field.placeholder | #babbbf | color.palette.interface.i7 | --field-placeholder | Semantic alias |
| color.text.muted | #a0a2a7 | color.palette.interface.i6 | --muted | Semantic alias |
| color.border.default | #53555a | color.palette.interface.i3 | --border | Semantic alias |
| color.border.field | #53555a | color.border.default | --field-border | Semantic alias |
| color.separator.default | #53555a | — | --separator | Preview proposal |
| color.selection.hover | #3b3c40 | — | --ds-selection-hover | Preview proposal |
| color.table.row.alternate | #222325 | color.background.canvas | --ds-table-stripe | Semantic alias |
| color.action.primary | #1e55eb | — | --accent | Preview proposal |
| color.action.primary.foreground | #ffffff | — | --accent-foreground | Preview proposal |
| color.action.secondary | #3b3c40 | — | --default | Preview proposal |
| color.action.secondary.foreground | #f4f5f5 | color.text.primary | --default-foreground | Semantic alias |
| color.action.link | #1e55eb | — | --link | Preview proposal |
| color.selection.active | #050505 | — | --segment | Preview proposal |
| color.status.success.fill | #3ee089 | — | --success | Preview proposal |
| color.status.success.text-on-fill | #0a0a0b | — | --success-foreground | Preview proposal |
| color.status.success.soft | #0b4627 | — | --success-soft | Preview proposal |
| color.status.success.soft-foreground | #eefcf4 | — | --success-soft-foreground | Preview proposal |
| color.status.warning.fill | #ff871f | — | --warning | Preview proposal |
| color.status.warning.text-on-fill | #0a0a0b | — | --warning-foreground | Preview proposal |
| color.status.warning.soft | #522000 | — | --warning-soft | Preview proposal |
| color.status.warning.soft-foreground | #fff4eb | — | --warning-soft-foreground | Preview proposal |
| color.status.danger.fill | #ff1f1f | — | --danger | Preview proposal |
| color.status.danger.text-on-fill | #0a0a0b | — | --danger-foreground | Preview proposal |
| color.status.danger.soft | #520000 | — | --danger-soft | Preview proposal |
| color.status.danger.soft-foreground | #ffebeb | — | --danger-soft-foreground | Preview proposal |
| color.status.info.soft | #002152 | — | --ds-info-soft | Preview proposal |
| color.status.info.foreground | #ebf3ff | — | --ds-info-text | Preview proposal |
| color.chart.series.1 | #a268ff | — | --ds-chart-1 | Preview proposal |
| color.chart.series.2 | #ff7777 | — | --ds-chart-2 | Preview proposal |
| color.chart.series.3 | #ffcc68 | — | --ds-chart-3 | Preview proposal |
| color.chart.series.4 | #00c2ee | — | --ds-chart-4 | Preview proposal |
| color.chart.series.5 | #679bff | — | --ds-chart-5 | Preview proposal |
| color.chart.series.6 | #00ee98 | — | --ds-chart-6 | Preview proposal |
| color.chart.series.7 | #bac3cf | — | --ds-chart-7 | Preview proposal |
| color.chart.series.8 | #505d6f | — | --ds-chart-8 | Preview proposal |
| geometry.radius.nested-inner | 12 | — | --ds-radius-inner | BDS Radius/Rounded/Corner M |
| geometry.spacing.nested-inset | 8 | — | --ds-nested-inset | Preview density profile |
| geometry.radius.nested-outer | 20 | — | --ds-radius-outer | Derived: inner + inset |
| geometry.radius.heroui-base | 0.5rem | — | --radius | Preview HeroUI adapter |
| geometry.radius.field | 0.75rem | — | --field-radius | BDS Radius/Rounded/Corner M |
| geometry.spacing.unit | 0.25rem | — | --spacing | Preview density profile |
| spacing.scale.2 | 2 | — | --ds-space-2 | BDS observed values · scale proposal |
| spacing.scale.4 | 4 | — | --ds-space-4 | BDS observed values · scale proposal |
| spacing.scale.8 | 8 | — | --ds-space-8 | BDS observed values · scale proposal |
| spacing.scale.12 | 12 | — | --ds-space-12 | BDS observed values · scale proposal |
| spacing.scale.16 | 16 | — | --ds-space-16 | BDS observed values · scale proposal |
| spacing.scale.24 | 24 | — | --ds-space-24 | BDS observed values · scale proposal |
| spacing.scale.32 | 32 | — | --ds-space-32 | BDS observed values · scale proposal |
| spacing.scale.48 | 48 | — | --ds-space-48 | BDS observed values · scale proposal |
| elevation.level-1 | 0 4px 12px rgb(0 0 0 / 0.04) | — | --ds-elevation-1 | BDS effect style Level 1 |
| elevation.level-2 | 1px 4px 16px rgb(0 0 0 / 0.08) | — | --ds-elevation-2 | BDS effect style Level 2 |
| elevation.level-3 | 2px 4px 16px rgb(0 0 0 / 0.12) | — | --ds-elevation-3 | BDS effect style Level 3 |
| typography.family | Inter, ui-sans-serif, system-ui, sans-serif | — | --font-sans | HeroUI reference default; Inter also used in BDS |
| typography.scale | 1 | — | Reference only | Preview adjustable profile |
| typography.legacy.title.page | 32 | — | Reference only | BDS text style Title/Page |
| typography.legacy.title.section | 24 | — | Reference only | BDS text style Title/Section |
| typography.legacy.title.group | 18 | — | Reference only | BDS text style Title/Group |
| typography.legacy.subtitle.page | 24 | — | Reference only | BDS text style Subtitle/Page |
| typography.legacy.subtitle.section | 18 | — | Reference only | BDS text style Subtitle/Section |
| typography.legacy.subtitle.group | 14 | — | Reference only | BDS text style Subtitle/Group |
| typography.legacy.subtitle.body | 12 | — | Reference only | BDS text style Subtitle/Body |
| typography.legacy.button.large | 20 | — | Reference only | BDS text style Button/Large |
| typography.legacy.button.medium | 16 | — | Reference only | BDS text style Button/Medium |
| typography.legacy.button.small | 12 | — | Reference only | BDS text style Button/Small |
| typography.legacy.button.xsmall | 10 | — | Reference only | BDS text style Button/XSmall |
| typography.legacy.body.paragraph | 16 | — | Reference only | BDS text style Body/Paragraph |
| typography.legacy.body.tag | 14 | — | Reference only | BDS text style Body/Tag |
| typography.legacy.body.display.label | 12 | — | Reference only | BDS text style Body/Display/Label |
| typography.legacy.body.display.default | 16 | — | Reference only | BDS text style Body/Display/Default |
| typography.legacy.body.display.accent | 16 | — | Reference only | BDS text style Body/Display/Accent |
| typography.legacy.body.selection.default | 14 | — | Reference only | BDS text style Body/Selection/Default |
| typography.legacy.body.selection.hover | 14 | — | Reference only | BDS text style Body/Selection/Hover |
| typography.legacy.body.selection.selected | 14 | — | Reference only | BDS text style Body/Selection/Selected |
| typography.legacy.navigation.nav item | 14 | — | Reference only | BDS text style Navigation/Nav item |
| typography.legacy.system responding.validation | 12 | — | Reference only | BDS text style System responding/Validation |
| typography.legacy.system responding.tooltip | 14 | — | Reference only | BDS text style System responding/Tooltip |
| typography.legacy.system responding.summary mesage | 14 | — | Reference only | BDS text style System responding/Summary mesage |
| typography.legacy.system responding.status | 14 | — | Reference only | BDS text style System responding/Status |
| typography.legacy.date picker.today | 12 | — | Reference only | BDS text style Date picker/Today |
| typography.legacy.date picker.date.selected | 12 | — | Reference only | BDS text style Date picker/Date/Selected |
| typography.legacy.date picker.date.default | 12 | — | Reference only | BDS text style Date picker/Date/Default |
| typography.legacy.date picker.weekdays | 10 | — | Reference only | BDS text style Date picker/Weekdays |
| typography.legacy.navigation.tab item | 14 | — | Reference only | BDS text style Navigation/Tab item |
| typography.legacy.navigation.breadcrumb item | 10 | — | Reference only | BDS text style Navigation/Breadcrumb item |
| typography.legacy.title.extra.xtra light | 48 | — | Reference only | BDS text style Title/Extra/Xtra light |
| typography.legacy.title.extra.semibold | 48 | — | Reference only | BDS text style Title/Extra/Semibold |
| typography.legacy.data table.heading | 16 | — | Reference only | BDS text style Data table/Heading |
| typography.legacy.data table.value | 16 | — | Reference only | BDS text style Data table/Value |
| typography.legacy.data table.substitution | 12 | — | Reference only | BDS text style Data table/Substitution |
| typography.legacy.body.input.static.label | 12 | — | Reference only | BDS text style Body/Input/Static/Label |
| typography.legacy.body.input.static.value | 16 | — | Reference only | BDS text style Body/Input/Static/Value |
| typography.legacy.body.input.static.substitution | 16 | — | Reference only | BDS text style Body/Input/Static/Substitution |
| typography.legacy.body.input.facial.label | 14 | — | Reference only | BDS text style Body/Input/Facial/Label |
| typography.legacy.body.input.facial.value | 16 | — | Reference only | BDS text style Body/Input/Facial/Value |
| typography.legacy.body.input.facial.accent | 16 | — | Reference only | BDS text style Body/Input/Facial/Accent |
| typography.legacy.body.input.floating.value | 16 | — | Reference only | BDS text style Body/Input/Floating/Value |
| typography.legacy.body.input.floating.substitution | 14 | — | Reference only | BDS text style Body/Input/Floating/Substitution |
| typography.legacy.body.input.floating.label.default | 16 | — | Reference only | BDS text style Body/Input/Floating/Label/Default |
| typography.legacy.body.input.floating.label.accent | 12 | — | Reference only | BDS text style Body/Input/Floating/Label/Accent |
| typography.legacy.body.input.search.value | 12 | — | Reference only | BDS text style Body/Input/Search/Value |
| layer.tooltip.native | 100000 | — | Reference only | Observed React Aria overlay manager |
| motion.controls | 120ms | — | --ds-motion-control | Existing motion registry fast token |
| motion.panel | 260ms | — | --ds-motion-panel | Existing motion registry panel token |
| motion.ease-out | cubic-bezier(0, 0, 0.2, 1) | — | --ds-motion-ease | Existing motion registry easeOut token |

