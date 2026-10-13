import bds from './bds-source.json';
import { tokens as motionTokens } from '../../ui/src/motion/motion.config';

export type ThemeSettings = {
  preset: 'neutral' | 'bds' | 'custom'; mode: 'light' | 'dark';
  radius: 'sharp' | 'rounded' | 'circular'; density: 'comfortable' | 'compact';
  fontScale: number; hue: number; chroma: number; accentLightness: number;
  contrastSafe: boolean; reduceMotion: boolean;
};
export const defaultSettings: ThemeSettings = {
  preset: 'neutral', mode: 'dark', radius: 'rounded', density: 'comfortable',
  fontScale: 1, hue: 0, chroma: 0, accentLightness: 0.58, contrastSafe: true, reduceMotion: false,
};
export type Token = { name: string; value: string | number; type: 'color' | 'dimension' | 'number' | 'fontFamily' | 'duration' | 'cubicBezier' | 'shadow'; source: string; description: string; css?: string; alias?: string };
type Palette = Record<string, string>;
type SourceCollection = { vars: { name: string; values: Record<string, unknown> }[] };
const sourceCollection = bds.collections.find(c => c.name === 'Appearance')! as unknown as SourceCollection;
const sourceRadius = bds.collections.find(c => c.name === 'The Radius')! as unknown as SourceCollection;
export const sourceInfo = bds.source;
export const sourceSnapshot = bds;

function bdsPalette(mode: ThemeSettings['mode']): Palette {
  const result: Palette = {};
  for (const variable of sourceCollection.vars) {
    const value = variable.values[mode === 'light' ? 'Light' : 'Dark'];
    if (typeof value === 'string' && !value.includes('@')) result[variable.name] = value;
  }
  return result;
}
// Read from the actual reference page in Chromium, not guessed from URL parameters.
const reference = {
  light: { canvas: 'oklch(97.02% 0 0)', body: 'oklch(21.03% 0 0)', surface: 'oklch(100% 0 0)',
    secondary: 'oklch(95.24% 0 0)', tertiary: 'oklch(93.73% 0 0)', default: 'oklch(94% 0 0)',
    muted: 'oklch(55.17% 0 0)', border: 'oklch(90% 0 0)', separator: 'oklch(92% 0 0)',
    accent: 'oklch(0 0 0)', accentText: 'oklch(99.11% 0 0)', field: 'oklch(100% 0 0)' },
  dark: { canvas: 'oklch(12% 0 0)', body: 'oklch(99.11% 0 0)', surface: 'oklch(21.03% 0 0)',
    secondary: 'oklch(25.7% 0 0)', tertiary: 'oklch(27.21% 0 0)', default: 'oklch(27.4% 0 0)',
    muted: 'oklch(70.5% 0 0)', border: 'oklch(28% 0 0)', separator: 'oklch(25% 0 0)',
    accent: 'oklch(98.48% 0 0)', accentText: 'oklch(15% 0 0)', field: 'oklch(21.03% 0 0)' },
};
export const componentMapping = [
  { family: 'Actions', components: 'Button, Link', tokens: '--accent / --default / --link', note: 'Primary, secondary, ghost and link. Link is a semantic component, not a fabricated Button variant.' },
  { family: 'Fields', components: 'Input, TextArea, TextField, Select', tokens: '--field-* / --radius-field', note: 'BDS I2 fill, I3 border. Reference preset keeps stock HeroUI field surfaces.' },
  { family: 'Selection', components: 'Checkbox, RadioGroup, Switch, Tabs', tokens: '--accent / --default / --segment', note: 'Native React Aria states and keyboard interaction.' },
  { family: 'Containers', components: 'Card, Surface', tokens: '--surface / --surface-shadow', note: 'Elevation 1. Stock component geometry is controlled by the HeroUI radius scale.' },
  { family: 'Data', components: 'Table, Calendar, Chip, ProgressBar', tokens: '--ds-table-stripe / --separator / status colors', note: 'Table stripe uses I1, independent semantic alias. Chart data uses categorical colors, not status colors.' },
  { family: 'Overlays', components: 'Select.Popover, Popover, Modal, Drawer, Tooltip', tokens: '--overlay / --ds-elevation-2 / --ds-elevation-3', note: 'One disclosed elevation adapter selects Level 2 versus Level 3; not a new visual skin.' },
  { family: 'Feedback', components: 'Alert, Spinner, Skeleton', tokens: '--danger / --warning / --success', note: 'Status foreground and background are separate; reduced motion preserves information.' },
];

export function contrastRatio(foreground: string, background: string): number | null {
  if (!/^#[\da-f]{6}$/i.test(foreground) || !/^#[\da-f]{6}$/i.test(background)) return null;
  const luminance = (hex: string) => {
    const [r, g, b] = hex.slice(1).match(/../g)!.map(n => parseInt(n, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
export function resolveTheme(settings: ThemeSettings) {
  const values: Record<string, string> = {};
  const tokens: Token[] = [];
  const add = (name: string, value: string | number, type: Token['type'], source: string, description: string, css?: string, alias?: string) => {
    tokens.push({ name, value, type, source, description, css, alias });
    if (css) values[css] = String(value);
  };
  const palette = bdsPalette(settings.mode);
  const isBds = settings.preset === 'bds'; const ref = reference[settings.mode];
  const keyName = (name: string) => `color.palette.${name.toLowerCase().replaceAll('/', '.').replaceAll(' ', '-')}`;
  if (isBds) for (const [name, value] of Object.entries(palette)) add(keyName(name), value, 'color', `BDS Appearance/${name}/${settings.mode}`, 'Original source palette; unchanged.');
  else for (const [name, value] of Object.entries(ref)) add(`color.palette.neutral.${name}`, value, 'color', 'HeroUI Theme Builder reference · 2026-10-12', 'Observed neutral reference value.');
  const pick = (name: string, key: keyof typeof ref) => isBds ? palette[name] : ref[key];
  const origin = (name: string, key: string) => isBds ? keyName(name) : `color.palette.neutral.${key}`;
  const role = (name: string, value: string, css: string, description: string, alias?: string) => add(`color.${name}`, value, 'color', alias ? 'Semantic alias' : 'Preview proposal', description, css, alias);
  const body = pick('Interface/I9', 'body'); const canvas = pick('Interface/I1', 'canvas');
  const field = pick('Interface/I2', 'field'); const surface = pick('Interface/Container', 'surface');
  const placeholderSource = pick('Interface/I6', 'muted');
  const sourceContrast = contrastRatio(placeholderSource, field);
  const placeholder = isBds && settings.contrastSafe && sourceContrast !== null && sourceContrast < 4.5 ? palette['Interface/I7'] : placeholderSource;
  let accent = isBds ? palette['Primary/Primary3'] : ref.accent;
  let accentText = isBds ? palette['Interface/Absolute White'] : ref.accentText;
  if (settings.preset === 'custom') {
    accent = `oklch(${settings.accentLightness} ${settings.chroma} ${settings.hue})`;
    accentText = settings.accentLightness > .65 ? 'oklch(15% 0 0)' : 'oklch(99.11% 0 0)';
  }
  role('background.canvas', canvas, '--background', 'I1 main background.', origin('Interface/I1', 'canvas'));
  role('text.primary', body, '--foreground', 'I9 body text.', origin('Interface/I9', 'body'));
  role('surface.container', surface, '--surface', 'Container background.', origin('Interface/Container', 'surface'));
  role('surface.secondary', isBds ? palette['Interface/I1'] : ref.secondary, '--surface-secondary', 'Nested surface.');
  role('surface.tertiary', isBds ? palette['Interface/I2'] : ref.tertiary, '--surface-tertiary', 'Higher prominence surface.');
  role('surface.overlay', surface, '--overlay', 'Floating surface; elevation is separate.');
  role('field.background', field, '--field-background', 'I2 for BDS fields; stock reference field for Neutral.', origin('Interface/I2', 'field'));
  role('field.foreground', body, '--field-foreground', 'Body text in editable fields.', 'color.text.primary');
  role('field.placeholder', placeholder, '--field-placeholder', placeholder !== placeholderSource ? 'Contrast-safe proposal: I7 instead of I6; source I6 remains unchanged.' : 'Placeholder source value.', origin(placeholder !== placeholderSource ? 'Interface/I7' : 'Interface/I6', 'muted'));
  role('text.muted', pick('Interface/I6', 'muted'), '--muted', 'Secondary text; evaluate against its actual background.', origin('Interface/I6', 'muted'));
  role('border.default', pick('Interface/I3', 'border'), '--border', 'I3 default border.', origin('Interface/I3', 'border'));
  role('border.field', values['--border'], '--field-border', 'All field borders follow I3.', 'color.border.default');
  role('separator.default', isBds ? values['--border'] : ref.separator, '--separator', 'Separators are not elevation shadows.');
  role('selection.hover', isBds ? palette['Interface/I2'] : ref.default, '--ds-selection-hover', 'Selection hover semantic role, independent from fields.');
  role('table.row.alternate', canvas, '--ds-table-stripe', 'Owner confirmed table stripe = I1.', 'color.background.canvas');
  role('action.primary', accent, '--accent', 'Primary action color.');
  role('action.primary.foreground', accentText, '--accent-foreground', 'Text on primary action.');
  role('action.secondary', isBds ? palette['Interface/I2'] : ref.default, '--default', 'Stock secondary action surface.');
  role('action.secondary.foreground', body, '--default-foreground', 'Secondary and ghost text.', 'color.text.primary');
  role('action.link', accent, '--link', 'Link uses accent.');
  role('selection.active', surface, '--segment', 'Segment/Tabs indicator surface.');
  values['--surface-foreground'] = body; values['--surface-secondary-foreground'] = body; values['--surface-tertiary-foreground'] = body; values['--overlay-foreground'] = body; values['--segment-foreground'] = body;
  const statuses = { success: 'Green/G', warning: 'Orange/O', danger: 'Red/R' };
  for (const [status, source] of Object.entries(statuses)) {
    const base = palette[`Elementary/${source}3`]; const soft = palette[`Elementary/${source}1`]; const strong = palette[`Elementary/${source}5`];
    role(`status.${status}.fill`, base, `--${status}`, 'Source status fill; never assumed to be readable text.');
    role(`status.${status}.text-on-fill`, '#0a0a0b', `--${status}-foreground`, 'Dark foreground on bright status fill in either mode.');
    role(`status.${status}.soft`, soft, `--${status}-soft`, 'Status surface.');
    role(`status.${status}.soft-foreground`, strong, `--${status}-soft-foreground`, 'Separate readable status text.');
  }
  role('status.info.soft', palette['Elementary/Blue/B1'], '--ds-info-soft', 'Information background.');
  role('status.info.foreground', palette['Elementary/Blue/B5'], '--ds-info-text', 'Information foreground.');
  for (let index = 1; index <= 8; index++) role(`chart.series.${index}`, palette[`Chart/${index}`], `--ds-chart-${index}`, 'Categorical palette, not performance scoring.');
  const radiusMap = { sharp: 'Sharp', rounded: 'Rounded', circular: 'Circular' } as const;
  const mode = radiusMap[settings.radius];
  const radiusValue = (name: string) => Number(sourceRadius.vars.find(v => v.name === name)!.values[mode]);
  const inner = radiusValue('Corner/Corner M');
  const inset = settings.density === 'compact' ? 4 : 8;
  add('geometry.radius.nested-inner', inner, 'dimension', `BDS Radius/${mode}/Corner M`, 'Concentric sample inner radius.', '--ds-radius-inner');
  add('geometry.spacing.nested-inset', inset, 'dimension', 'Preview density profile', 'Actual uniform inset in the geometry sample.', '--ds-nested-inset');
  add('geometry.radius.nested-outer', inner + inset, 'dimension', 'Derived: inner + inset', 'Only for a genuinely concentric nested pair.', '--ds-radius-outer');
  const baseRadius = settings.radius === 'sharp' ? 4 : settings.radius === 'rounded' ? 8 : 12;
  add('geometry.radius.heroui-base', `${baseRadius / 16}rem`, 'dimension', 'Preview HeroUI adapter', 'Stock HeroUI radius scale; not a promise of per-component BDS radius parity.', '--radius');
  add('geometry.radius.field', `${radiusValue('Corner/Corner M') / 16}rem`, 'dimension', `BDS Radius/${mode}/Corner M`, 'Independent field radius using public HeroUI variable.', '--field-radius');
  add('geometry.spacing.unit', settings.density === 'compact' ? '0.2rem' : '0.25rem', 'dimension', 'Preview density profile', 'Tailwind/HeroUI shared spacing unit.', '--spacing');
  for (const space of [2, 4, 8, 12, 16, 24, 32, 48]) add(`spacing.scale.${space}`, space, 'dimension', 'BDS observed values · scale proposal', 'Spacing scale; not all legacy values are canonical.', `--ds-space-${space}`);
  const shadows = { 1: '0 4px 12px rgb(0 0 0 / 0.04)', 2: '1px 4px 16px rgb(0 0 0 / 0.08)', 3: '2px 4px 16px rgb(0 0 0 / 0.12)' };
  for (const [level, shadow] of Object.entries(shadows)) add(`elevation.level-${level}`, shadow, 'shadow', `BDS effect style Level ${level}`, 'Original shadow; dark mode can rely additionally on surface separation.', `--ds-elevation-${level}`);
  values['--surface-shadow'] = shadows[1]; values['--field-shadow'] = 'none'; values['--overlay-shadow'] = shadows[2];
  add('typography.family', 'Inter, ui-sans-serif, system-ui, sans-serif', 'fontFamily', 'HeroUI reference default; Inter also used in BDS', 'Locally bundled default font.', '--font-sans');
  add('typography.scale', settings.fontScale, 'number', 'Preview adjustable profile', 'Root font scale; component hierarchy remains library-owned.');
  values['--ds-font-size'] = `${16 * settings.fontScale}px`;
  for (const style of bds.styles.texts) add(`typography.legacy.${style.name.toLowerCase().replaceAll('/', '.')}`, style.size, 'dimension', `BDS text style ${style.name}`, 'Legacy reference, not automatically applied to HeroUI components.');
  add('layer.tooltip.native', 100000, 'number', 'Observed React Aria overlay manager', 'Library-owned tooltip stacking; reference only, no CSS override.');
  add('motion.controls', `${motionTokens.duration.fast}ms`, 'duration', 'Existing motion registry fast token', 'Control transition timing.', '--ds-motion-control');
  add('motion.panel', `${motionTokens.duration.panel}ms`, 'duration', 'Existing motion registry panel token', 'Panel timing where an adapter controls timing.', '--ds-motion-panel');
  add('motion.ease-out', `cubic-bezier(${motionTokens.easing.easeOut.join(', ')})`, 'cubicBezier', 'Existing motion registry easeOut token', 'Motion easing.', '--ds-motion-ease');
  return { values, tokens, sourceContrast, placeholderAdjusted: placeholder !== placeholderSource, settings };
}
export function exportCss(settings: ThemeSettings): string {
  const { values } = resolveTheme(settings);
  return `/* BigIn HeroUI theme · draft · ${settings.preset}/${settings.mode}\n   Load after HeroUI styles. Component adapters: apps/web/src/preview/adapters.css */\n[data-theme="${settings.mode}"] {\n${Object.entries(values).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}\n`;
}
export function exportTokens(settings: ThemeSettings) {
  const theme = resolveTheme(settings);
  return { schema: 'bigin.design-tokens/v1', status: 'draft', settings, source: sourceInfo,
    tokens: Object.fromEntries(theme.tokens.map(token => [token.name, { type: token.type, value: token.value, alias: token.alias, source: token.source, description: token.description, css: token.css }])) };
}
export function isSettings(value: unknown): value is ThemeSettings {
  if (!value || typeof value !== 'object') return false;
  const v = value as ThemeSettings;
  return ['neutral','bds','custom'].includes(v.preset) && ['light','dark'].includes(v.mode) && ['sharp','rounded','circular'].includes(v.radius) && ['comfortable','compact'].includes(v.density) &&
    Number.isFinite(v.fontScale) && v.fontScale >= .9 && v.fontScale <= 1.15 && Number.isFinite(v.hue) && v.hue >= 0 && v.hue <= 360 && Number.isFinite(v.chroma) && v.chroma >= 0 && v.chroma <= .22 && Number.isFinite(v.accentLightness) && v.accentLightness >= .2 && v.accentLightness <= .9 && typeof v.contrastSafe === 'boolean' && typeof v.reduceMotion === 'boolean';
}
