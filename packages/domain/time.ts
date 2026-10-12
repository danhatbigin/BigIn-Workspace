export type Task = { id: string; project: string; title: string; status: 'In progress' | 'Done' | 'To do' };
export type Entry = { id: string; taskId: string; date: string; hours: number; note: string };
export type Snapshot = { version: 1; tasks: Task[]; entries: Entry[] };
export type DuplicateRow = { date: string; hours: string };

// ISO calendar dates are work dates, not UTC timestamps.
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function fromKey(key: string): Date { return new Date(`${key}T12:00:00`); }
export function addDays(key: string, amount: number): string {
  const date = fromKey(key); date.setDate(date.getDate() + amount); return dateKey(date);
}
export function startOfWeek(key: string): string { return addDays(key, -((fromKey(key).getDay() + 6) % 7)); }
export function isWorkingDay(key: string): boolean { const day = fromKey(key).getDay(); return day !== 0 && day !== 6; }
export function monthDays(key: string): string[] {
  const date = fromKey(key); const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: days }, (_, index) => `${key.slice(0, 7)}-${String(index + 1).padStart(2, '0')}`);
}
export function hoursOn(entries: Entry[], date: string): number { return entries.filter(e => e.date === date).reduce((sum, e) => sum + e.hours, 0); }
export function summarize(entries: Entry[], eligibleDates: string[]) {
  const days = [...new Set(eligibleDates)];
  const totals = days.map(date => hoursOn(entries, date));
  return { logged: totals.reduce((a, b) => a + b, 0), expected: days.length * 8,
    missing: totals.reduce((sum, hours) => sum + Math.max(0, 8 - hours), 0),
    completeDays: totals.filter(hours => hours >= 8).length, days: days.length };
}
// Từng ngày: giờ đã log và giờ thiếu so với 8h, không bù giữa các ngày (LT-01-R01). Không gắn nhãn (P-03 Open).
export function dailyBreakdown(entries: Entry[], eligibleDates: string[]): { date: string; hours: number; missing: number }[] {
  return [...new Set(eligibleDates)].sort().map(date => {
    const hours = hoursOn(entries, date);
    return { date, hours, missing: Math.max(0, 8 - hours) };
  });
}
export function hasSameTask(entries: Entry[], taskId: string, date: string): boolean {
  return entries.some(e => e.taskId === taskId && e.date === date);
}
export function validHours(value: string): boolean {
  return value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) <= 24;
}
export function duplicateEntries(source: Entry, rows: DuplicateRow[], id: () => string): Entry[] {
  if (!rows.length || new Set(rows.map(row => row.date)).size !== rows.length || rows.some(row => !validHours(row.hours))) {
    throw new Error('Each day needs valid hours before saving.');
  }
  return rows.map(row => ({ ...source, id: id(), date: row.date, hours: Number(row.hours) }));
}

export function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== 'object') return false;
  const data = value as Snapshot;
  if (data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.entries)) return false;
  const tasksValid = data.tasks.every(t => t && typeof t.id === 'string' && typeof t.project === 'string' && typeof t.title === 'string' && ['To do', 'In progress', 'Done'].includes(t.status));
  if (!tasksValid) return false;
  const ids = new Set(data.tasks.map(t => t.id));
  return ids.size === data.tasks.length && new Set(data.entries.map(e => e?.id)).size === data.entries.length && data.entries.every(e =>
    e && typeof e.id === 'string' && ids.has(e.taskId) && typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) &&
    !Number.isNaN(fromKey(e.date).getTime()) && dateKey(fromKey(e.date)) === e.date && typeof e.note === 'string' &&
    typeof e.hours === 'number' && Number.isFinite(e.hours) && e.hours > 0 && e.hours <= 24);
}
