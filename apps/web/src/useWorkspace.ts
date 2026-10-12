import { useState } from 'react';
import { demoSnapshot } from '../../../packages/domain/demo';
import { isSnapshot, type Snapshot } from '../../../packages/domain/time';
const KEY = 'bigin-demo-v1';
function load(today: string): { data: Snapshot; warning: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { data: demoSnapshot(today), warning: '' };
    const parsed: unknown = JSON.parse(raw);
    if (isSnapshot(parsed)) return { data: parsed, warning: '' };
    return { data: demoSnapshot(today), warning: 'Saved local data is invalid. Sample data is shown; the old data has not been overwritten.' };
  } catch { return { data: demoSnapshot(today), warning: 'Couldn’t read local data. Check storage permissions before saving.' }; }
}
export function useWorkspace(today: string) {
  const [initial] = useState(() => load(today));
  const [data, setData] = useState(initial.data);
  const [warning, setWarning] = useState(initial.warning);
  function save(next: Snapshot): boolean {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setData(next); setWarning(''); return true; }
    catch { setWarning('Couldn’t save on this device. What you entered is kept.'); return false; }
  }
  return { data, save, warning };
}
