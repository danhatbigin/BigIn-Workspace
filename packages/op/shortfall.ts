import { dailyBreakdown, type Entry } from '../domain/time';
import type { OpTimeEntry, TimeEntriesResult } from './client';

// Chuyển entry OP sang Entry của domain. Không mang comment/tên work package vào app.
export function toDomainEntries(entries: OpTimeEntry[]): Entry[] {
  return entries.map(e => ({
    id: `op-${e.id}`, taskId: e.workPackageId === null ? 'op-no-work-package' : `op-wp-${e.workPackageId}`,
    date: e.date, hours: e.hours, note: '',
  }));
}

// Thiếu giờ từng ngày theo LT-01-R01 (không bù). eligibleDates do caller cấp: quy tắc ngày thuộc diện tính (P-01) còn Open.
// Chưa gắn nhãn 8/12/16 (P-03 còn Open). Nếu dữ liệu partial thì reliable=false: số thiếu có thể thừa.
export function shortfallFromOp(result: TimeEntriesResult, eligibleDates: string[]) {
  const days = dailyBreakdown(toDomainEntries(result.entries), eligibleDates);
  return {
    days,
    loggedTotal: days.reduce((s, d) => s + d.hours, 0),
    missingTotal: days.reduce((s, d) => s + d.missing, 0),
    reliable: result.status === 'complete',
  };
}
