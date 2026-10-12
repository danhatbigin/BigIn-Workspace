import { useSyncExternalStore } from 'react';
const query = '(prefers-reduced-motion: reduce)';
function subscribe(update: () => void) {
  const media = matchMedia(query);
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}
// React and CSS adapters must react immediately when the OS preference changes.
export function useMotionPreference(): boolean {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}
