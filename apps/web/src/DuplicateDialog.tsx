import { useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowLeft, Copy, TriangleAlert, X } from 'lucide-react';
import { duplicateEntries, hasSameTask, validHours, type DuplicateRow, type Entry, type Task } from '../../../packages/domain/time';
import { transitionFor } from '../../../packages/ui/src/motion/motion.config';
import { Dialog } from './Dialog';
import { hours, longDate } from './format';

export function DuplicateDialog({ source, task, dates, draftHours, entries, reduced, onBack, onCancel, onSave }: {
  source: Entry; task: Task; dates: string[]; draftHours: Record<string, string>; entries: Entry[]; reduced: boolean;
  onBack: (rows: DuplicateRow[]) => void; onCancel: () => void; onSave: (entries: Entry[]) => boolean;
}) {
  const [rows, setRows] = useState<DuplicateRow[]>(dates.map(date => ({ date, hours: draftHours[date] ?? '' })));
  const [error, setError] = useState(''); const submitting = useRef(false); const backRef = useRef<HTMLButtonElement>(null);
  function remove(date: string, index: number) {
    setRows(current => current.filter(row => row.date !== date));
    const next = rows[index + 1] ?? rows[index - 1];
    if (next) document.getElementById(`duplicate-${next.date}`)?.focus(); else backRef.current?.focus();
  }
  function submit(event: React.FormEvent) {
    event.preventDefault(); if (submitting.current) return;
    if (!rows.length || rows.some(row => !validHours(row.hours))) { setError('Enter valid hours for all remaining days.'); return; }
    submitting.current = true;
    try { if (!onSave(duplicateEntries(source, rows, () => crypto.randomUUID()))) setError('Couldn’t save. The hours you entered are kept.'); }
    finally { submitting.current = false; }
  }
  return <Dialog titleId="duplicate-title" className="duplicate-shell" onCancel={() => onBack(rows)}>
    <m.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transitionFor('duplicate.hoursEnter', reduced)}>
      <header className="dialog-header"><div><p className="eyebrow">DUPLICATE · STEP 2/2</p><h2 id="duplicate-title">One day, one stretch of time.</h2><p className="muted">Look back and enter the actual hours for each day.</p></div><button className="icon-button" aria-label="Back to date selection" onClick={() => onBack(rows)}><X size={20} /></button></header>
      <div className="source-summary"><Copy size={19} /><div><small>{task.project} · {task.id}</small><strong>{task.title}</strong></div></div>
      <form onSubmit={submit}>
        <div className="duplicate-rows"><AnimatePresence initial={false}>
          {rows.map((row, index) => {
            const duplicate = hasSameTask(entries, source.taskId, row.date);
            return <m.div key={row.date} layout={reduced ? false : 'position'} initial={false} exit={{ opacity: 0 }} transition={transitionFor('duplicate.rowRemove', reduced)} className={`duplicate-row ${duplicate ? 'has-warning' : ''}`} data-testid={`duplicate-row-${row.date}`}>
              <div className="duplicate-row-main"><label htmlFor={`duplicate-${row.date}`}>{longDate(row.date)}</label><div className="compact-hours"><input id={`duplicate-${row.date}`} aria-label={`Hours ${row.date}`} autoFocus={index === 0} type="number" inputMode="decimal" min="0.01" max="24" step="any" required placeholder="Enter hours" value={row.hours} onChange={e => setRows(current => current.map(r => r.date === row.date ? { ...r, hours: e.target.value } : r))} /><span>hours</span></div><button type="button" className="icon-button" aria-label={`Remove ${row.date}`} onClick={() => remove(row.date, index)}><X size={17} /></button></div>
              {duplicate && <p className="duplicate-warning"><TriangleAlert size={15} /> This day already has a log for this task. Duplicate will add another entry.</p>}
            </m.div>;
          })}
        </AnimatePresence>{!rows.length && <div className="empty">No dates yet. Go back to choose dates to duplicate.</div>}</div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="duplicate-total"><span>{rows.length} days selected</span><strong>{hours(rows.reduce((sum, row) => sum + (validHours(row.hours) ? Number(row.hours) : 0), 0))} hours will be added</strong></div>
        <footer className="dialog-footer"><button ref={backRef} type="button" className="text-button" onClick={() => onBack(rows)}><ArrowLeft size={16} /> Choose dates again</button><div className="button-row"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button type="submit" className="primary" disabled={!rows.length}><Copy size={16} /> Duplicate {rows.length ? `(${rows.length})` : ''}</button></div></footer>
      </form>
    </m.section>
  </Dialog>;
}
