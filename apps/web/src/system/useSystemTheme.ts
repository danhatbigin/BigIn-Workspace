import { useEffect, useLayoutEffect, useState } from 'react';
import { defaultSettings, isSettings, resolveTheme, type ThemeSettings } from '../../../../packages/design-tokens/src/theme';
import { useMotionPreference } from '../useMotionPreference';

const storageKey = 'bigin-design-preview-v1';
function loadSettings(): ThemeSettings {
  try { const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null'); if (isSettings(value)) return value; } catch { /* Defaults also work without storage. */ }
  return { ...defaultSettings };
}
/** Both application routes consume the same resolver and persisted preferences. */
export function useSystemTheme() {
  const [settings, setSettings] = useState(loadSettings);
  const systemReduced = useMotionPreference();
  const reduced = settings.reduceMotion || systemReduced;
  useLayoutEffect(() => {
    const root = document.documentElement;
    const theme = resolveTheme(settings);
    root.dataset.biginSystem = ''; root.dataset.theme = settings.mode;
    root.dataset.reduceMotion = String(reduced); root.classList.remove('light', 'dark'); root.classList.add(settings.mode);
    for (const [key, value] of Object.entries(theme.values)) root.style.setProperty(key, value);
    root.style.setProperty('--ds-motion-control', reduced ? '0ms' : theme.values['--ds-motion-control']);
    root.style.setProperty('--ds-motion-panel', reduced ? '0ms' : theme.values['--ds-motion-panel']);
  }, [settings, reduced]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Theme remains usable. */ } }, [settings]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === storageKey && event.newValue) { try { const value: unknown = JSON.parse(event.newValue); if (isSettings(value)) setSettings(value); } catch { /* Ignore malformed external data. */ } } };
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  return { settings, setSettings, reduced };
}
