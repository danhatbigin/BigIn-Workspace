// Shared timing tokens for HeroUI CSS animations and generated documentation.
export const tokens = {
  duration: { instant: 0, reduced: 80, fast: 120, normal: 180, panel: 260, feedback: 450 },
  easing: { linear: [0, 0, 1, 1], easeIn: [0.4, 0, 1, 1], easeOut: [0, 0, 0.2, 1], easeInOut: [0.4, 0, 0.2, 1] },
} as const;
export const presets = {
  drawerEnter: { duration: 'panel', easing: 'easeOut', effect: 'HeroUI stock overlay enter geometry' },
  selection: { duration: 'fast', easing: 'easeOut', effect: 'selected color/border' },
} as const;
export const usages = {
  'ui.control': { preset: 'selection', owner: 'HeroUI/CSS', file: 'apps/web/src/system/adapters.css', rule: 'DS-002', reduced: 'instant' },
  'logDrawer.enter': { preset: 'drawerEnter', owner: 'HeroUI/CSS (stock geometry)', file: 'apps/web/src/system/adapters.css', rule: 'LT-02', reduced: 'instant' },
  'logDrawer.exit': { preset: 'selection', owner: 'HeroUI/CSS (stock geometry)', file: 'apps/web/src/system/adapters.css', rule: 'LT-02', reduced: 'instant' },
  'duplicate.daySelect': { preset: 'selection', owner: 'HeroUI ToggleButton/CSS', file: 'apps/web/src/system/WorkCalendar.tsx', rule: 'LT-03', reduced: 'instant' },
  'duplicate.hoursEnter': { preset: 'drawerEnter', owner: 'HeroUI Modal/CSS (stock geometry)', file: 'apps/web/src/system/adapters.css', rule: 'LT-03-R01', reduced: 'instant' },
} as const;
export type Usage = keyof typeof usages;
