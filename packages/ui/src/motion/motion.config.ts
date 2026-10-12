// Single source for Motion, CSS custom properties and generated documentation.
export const tokens = {
  duration: { instant: 0, reduced: 80, fast: 120, normal: 180, panel: 260, feedback: 450 },
  easing: { linear: [0, 0, 1, 1], easeIn: [0.4, 0, 1, 1], easeOut: [0, 0, 0.2, 1], easeInOut: [0.4, 0, 0.2, 1] },
} as const;
export const presets = {
  fadeIn: { duration: 'normal', easing: 'easeOut', effect: 'opacity 0 → 1' },
  drawerEnter: { duration: 'panel', easing: 'easeOut', effect: 'x 24 → 0, opacity 0 → 1' },
  drawerExit: { duration: 'normal', easing: 'easeIn', effect: 'x 0 → 24, opacity 1 → 0' },
  selection: { duration: 'fast', easing: 'easeOut', effect: 'selected color/border' },
  rowExit: { duration: 'normal', easing: 'easeInOut', effect: 'opacity 1 → 0, layout position' },
  warningReveal: { duration: 'normal', easing: 'easeOut', effect: 'warning color' },
  saveConfirmed: { duration: 'feedback', easing: 'easeOut', effect: 'opacity 0 → 1; static confirmation' },
} as const;
export const usages = {
  'logDrawer.enter': { preset: 'drawerEnter', owner: 'Motion', file: 'apps/web/src/Drawer.tsx', rule: 'LT-02', reduced: 'fade' },
  'logDrawer.exit': { preset: 'drawerExit', owner: 'Motion', file: 'apps/web/src/Drawer.tsx', rule: 'LT-02', reduced: 'fade' },
  'duplicate.modeEnter': { preset: 'fadeIn', owner: 'Motion', file: 'apps/web/src/App.tsx', rule: 'LT-03', reduced: 'fade' },
  'duplicate.daySelect': { preset: 'selection', owner: 'CSS', file: 'apps/web/src/styles.css', rule: 'LT-03', reduced: 'instant' },
  'duplicate.hoursEnter': { preset: 'fadeIn', owner: 'Motion', file: 'apps/web/src/DuplicateDialog.tsx', rule: 'LT-03-R01', reduced: 'fade' },
  'duplicate.rowRemove': { preset: 'rowExit', owner: 'Motion', file: 'apps/web/src/DuplicateDialog.tsx', rule: 'LT-03-R02', reduced: 'instant' },
  'duplicate.taskWarning': { preset: 'warningReveal', owner: 'CSS', file: 'apps/web/src/styles.css', rule: 'LT-03-R03', reduced: 'instant' },
  'log.saveConfirmed': { preset: 'saveConfirmed', owner: 'Motion', file: 'apps/web/src/App.tsx', rule: 'LT-01', reduced: 'instant' },
} as const;
export type Usage = keyof typeof usages;
export function transitionFor(usage: Usage, reduced: boolean) {
  const config = usages[usage]; const preset = presets[config.preset];
  const duration = reduced ? (config.reduced === 'instant' ? 0 : tokens.duration.reduced) : tokens.duration[preset.duration];
  return { type: 'tween' as const, duration: duration / 1000, ease: [...tokens.easing[preset.easing]] as [number, number, number, number] };
}
export function cssMotionVariables(reduced: boolean): Record<string, string> {
  return Object.fromEntries(Object.entries(usages).flatMap(([name, usage]) => {
    const preset = presets[usage.preset]; const transition = transitionFor(name as Usage, reduced);
    const key = name.replaceAll('.', '-');
    return [[`--motion-${key}-duration`, `${transition.duration * 1000}ms`], [`--motion-${key}-ease`, `cubic-bezier(${tokens.easing[preset.easing].join(',')})`]];
  }));
}
