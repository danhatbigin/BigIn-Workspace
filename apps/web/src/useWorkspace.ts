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
    return { data: demoSnapshot(today), warning: 'Dữ liệu local không hợp lệ. Bản mẫu đang được hiển thị; dữ liệu cũ chưa bị ghi đè.' };
  } catch { return { data: demoSnapshot(today), warning: 'Không đọc được dữ liệu local. Kiểm tra quyền lưu trữ trước khi lưu.' }; }
}
export function useWorkspace(today: string) {
  const [initial] = useState(() => load(today));
  const [data, setData] = useState(initial.data);
  const [warning, setWarning] = useState(initial.warning);
  function save(next: Snapshot): boolean {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setData(next); setWarning(''); return true; }
    catch { setWarning('Chưa lưu được trên máy. Nội dung đang nhập vẫn được giữ lại.'); return false; }
  }
  return { data, save, warning };
}
