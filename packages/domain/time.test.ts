import { describe, expect, it } from 'vitest';
import { addDays, duplicateEntries, hasSameTask, isSnapshot, monthDays, startOfWeek, summarize, validHours, type Entry } from './time';
import { demoSnapshot } from './demo';
const source: Entry = { id: 'original', taskId: 'task-1', date: '2026-10-05', hours: 6, note: 'Actual work' };
describe('LT-01-R01: daily completeness', () => {
  it('does not use a 10h day to hide the 2h deficit of a 6h day', () => {
    const dates = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
    const entries = [6, 10, 8, 8, 8].map((hours, i) => ({ ...source, id: String(i), date: dates[i], hours }));
    expect(summarize(entries, dates)).toEqual({ logged: 40, expected: 40, missing: 2, completeDays: 4, days: 5 });
  });
  it('excludes dates outside the supplied eligibility policy', () => {
    expect(summarize([{ ...source, date: '2026-10-10', hours: 20 }], ['2026-10-05']).missing).toBe(8);
    expect(summarize([], []).missing).toBe(0);
  });
});
describe('LT-03: duplication', () => {
  it('requires explicit hours and at least one target', () => {
    for (const input of ['', ' ', '0', '-2', 'NaN', 'Infinity', '25']) expect(validHours(input)).toBe(false);
    expect(validHours('1.25')).toBe(true);
    expect(() => duplicateEntries(source, [], () => 'id')).toThrow();
    expect(() => duplicateEntries(source, [{ date: '2026-10-06', hours: '' }], () => 'id')).toThrow();
  });
  it('adds independent target hours while preserving the source', () => {
    const before = { ...source }; let id = 0;
    const copies = duplicateEntries(source, [{ date: '2026-10-06', hours: '2' }, { date: '2026-10-07', hours: '3.5' }], () => `copy-${++id}`);
    expect(copies.map(e => e.hours)).toEqual([2, 3.5]); expect(source).toEqual(before);
    expect(copies[0].id).not.toBe(source.id); expect(copies[0].note).toBe(source.note);
  });
  it('same task on the same work date warns but does not block creation', () => {
    expect(hasSameTask([source], 'task-1', '2026-10-05')).toBe(true);
    expect(hasSameTask([source], 'other-id', '2026-10-05')).toBe(false);
    expect(duplicateEntries(source, [{ date: source.date, hours: '1' }], () => 'new')).toHaveLength(1);
  });
});
describe('calendar and persistence boundaries', () => {
  it('handles months, leap days and work dates without UTC shifting', () => {
    expect(monthDays('2024-02-01')).toHaveLength(29);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(startOfWeek('2026-10-11')).toBe('2026-10-05');
  });
  it('rejects malformed or orphan local records', () => {
    const data = demoSnapshot('2026-10-12'); expect(isSnapshot(data)).toBe(true);
    expect(isSnapshot({ ...data, entries: [{ ...source, taskId: 'missing' }] })).toBe(false);
    expect(isSnapshot({ ...data, entries: [{ ...data.entries[0], date: '2026-02-31' }] })).toBe(false);
    expect(isSnapshot(null)).toBe(false);
  });
});
