
import { Alert, Button, Card, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useRef, useState } from 'react';
import { ArrowLeft, Copy, X } from 'lucide-react';
import { duplicateEntries, hasSameTask, validHours, type DuplicateRow, type Entry, type Task } from '../../../packages/domain/time';
import { hours, longDate } from './format';
import type { BatchSaveResult } from '../../../packages/op/bridge';

export function DuplicateDialog({ source, task, dates, draftHours, entries, liveMode, onBack, onCancel, onComplete, onSave }: {
  source: Entry; task: Task; dates: string[]; draftHours: Record<string,string>; entries: Entry[];
  liveMode?:boolean; onComplete?:()=>void; onBack: (rows: DuplicateRow[]) => void; onCancel: () => void; onSave: (entries: Entry[]) => boolean | Promise<boolean|BatchSaveResult>;
}) {
  const [rows, setRows] = useState<DuplicateRow[]>(dates.map(date => ({ date,hours:draftHours[date] ?? '' })));
  const [error, setError] = useState(''); const submitting = useRef(false); const backRef = useRef<HTMLButtonElement>(null);
  const [pending,setPending]=useState(false); const [uncertain,setUncertain]=useState<string[]>([]);
  const ids=useRef(new Map(dates.map(date=>[date,crypto.randomUUID()])));
  function remove(date: string, index: number) { setRows(current => current.filter(row => row.date !== date)); const next = rows[index + 1] ?? rows[index - 1]; if (next) document.getElementById(`duplicate-${next.date}`)?.focus(); else backRef.current?.focus(); }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (submitting.current) return;
    if (!rows.length || rows.some(row => !validHours(row.hours))) { setError('Enter valid hours for all remaining days.'); return; }
    const retry=rows.filter(row=>!uncertain.includes(row.date)); if(!retry.length)return;
    submitting.current = true; setPending(true);setError('');
    try { const batch=duplicateEntries(source,retry,()=>crypto.randomUUID()).map(entry=>({...entry,id:ids.current.get(entry.date)!})); const result=await onSave(batch);
      if(result===false)setError('Couldn’t save. The hours you entered are kept.');
      else if(typeof result==='object') {const savedDates=result.outcomes.filter(outcome=>outcome.status==='saved').map(outcome=>outcome.date);const remaining=rows.filter(row=>!savedDates.includes(row.date));setRows(remaining);const unresolved=[...new Set([...uncertain,...result.outcomes.filter(outcome=>outcome.status==='uncertain').map(outcome=>outcome.date)])];setUncertain(unresolved);setError([unresolved.length ? 'Remaining days have an unknown save result. Check OpenProject before continuing.' : '',...result.outcomes.filter(outcome=>outcome.status!=='saved').map(outcome=>`${outcome.date}: ${outcome.message}`)].filter(Boolean).join(' '));if(!remaining.length)onComplete?.();}
    } catch {setError('Could not complete the save. Check OpenProject before trying again.');if(liveMode)setUncertain(retry.map(row=>row.date));}
    finally { submitting.current = false;setPending(false); }
  }
  return <Modal isOpen onOpenChange={open => { if (!open && !pending) onBack(rows); }}><Modal.Backdrop><Modal.Container size="lg"><Modal.Dialog className="ds-elevation-3">
    <Modal.Header><div className="flex items-start justify-between gap-3"><div><Modal.Heading>One day, one stretch of time.</Modal.Heading><p className="mt-2 text-sm text-muted">Look back and enter the actual hours for each day.</p></div><Button isIconOnly variant="ghost" aria-label="Back to date selection" isDisabled={pending} onPress={() => onBack(rows)}><X /></Button></div></Modal.Header>
    <Modal.Body><div className="flex flex-col gap-5"><Card variant="secondary"><Card.Header><Card.Description>{task.project} · {task.id}</Card.Description><Card.Title>{task.title}</Card.Title></Card.Header></Card>
      <Form id="duplicate-form" className="flex flex-col gap-4" onSubmit={submit}>{rows.map((row,index) => { const duplicate = hasSameTask(entries,source.taskId,row.date); return <Card key={row.date} variant="secondary" className={duplicate ? 'ds-warning-surface' : undefined} data-warning={duplicate} data-testid={`duplicate-row-${row.date}`}><Card.Content><div className="flex items-end gap-3"><TextField isRequired isDisabled={pending || uncertain.includes(row.date)} aria-label={`Hours ${row.date}`} className="min-w-0 flex-1"><Label>{longDate(row.date)}</Label><Input id={`duplicate-${row.date}`} aria-label={`Hours ${row.date}`} autoFocus={index === 0} type="number" inputMode="decimal" min="0.01" max="24" step="any" required placeholder="Enter hours" value={row.hours} onChange={e => setRows(current => current.map(r => r.date === row.date ? { ...r,hours:e.target.value } : r))} /></TextField><Button type="button" isIconOnly variant="ghost" aria-label={`Remove ${row.date}`} isDisabled={pending} onPress={() => remove(row.date,index)}><X /></Button></div>{duplicate && <div className="mt-3"><Alert status="warning"><Alert.Indicator /><Alert.Content><Alert.Title>This day already has a log for this task.</Alert.Title><Alert.Description>Duplicate will add another entry.</Alert.Description></Alert.Content></Alert></div>}</Card.Content></Card>; })}
        {!rows.length && <p className="text-sm text-muted">No dates yet. Go back to choose dates to duplicate.</p>}{error && <Alert status="danger" role="alert"><Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content></Alert>}<p className="text-sm text-muted">{rows.length} days selected · {hours(rows.reduce((sum,row) => sum + (validHours(row.hours) ? Number(row.hours) : 0),0))} hours will be added</p>
      </Form></div></Modal.Body><Modal.Footer><div className="flex w-full flex-wrap justify-between gap-3"><Button ref={backRef} isDisabled={pending} type="button" variant="ghost" onPress={() => onBack(rows)}><ArrowLeft /> Choose dates again</Button><div className="flex gap-2"><Button type="button" variant="secondary" isDisabled={pending} onPress={onCancel}>Cancel</Button><Button form="duplicate-form" type="submit" isPending={pending} isDisabled={!rows.some(row=>!uncertain.includes(row.date))}><Copy /> Duplicate {rows.length ? `(${rows.length})` : ''}</Button></div></div></Modal.Footer>
  </Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>;
}
