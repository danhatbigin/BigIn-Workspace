import { Chip, ProgressBar, ToggleButton } from '@heroui/react';
import { fromKey, hoursOn, isWorkingDay, type Entry } from '../../../../packages/domain/time';
import { hours } from '../format';

/** Business calendar composed from stock controls, without a calendar-specific skin. */
export function WorkCalendar({ days, lead, entries, today, selected, duplicating, onSelect }: { days: string[]; lead: number; entries: Entry[]; today: string; selected: string[]; duplicating: boolean; onSelect: (day: string) => void }) {
  return <div className="overflow-x-auto"><div className="min-w-140">
    <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-muted">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => <span key={day}>{day}</span>)}</div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: lead }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
      {days.map(day => {
        const total = hoursOn(entries, day); const count = entries.filter(entry => entry.date === day).length;
        return <ToggleButton key={day} isSelected={selected.includes(day)} onChange={() => onSelect(day)} aria-label={`${duplicating ? 'Select date' : 'View date'} ${day}`} className="h-auto min-h-28 w-full flex-col items-stretch justify-start gap-2 p-3">
          <span className="flex items-center justify-between"><span>{fromKey(day).getDate()}</span>{day === today && <Chip size="sm" variant="soft">Today</Chip>}</span>
          <span className="text-lg">{total ? `${hours(total)}h` : '—'}</span>
          <ProgressBar aria-label={`${day} daily hours`} value={Math.min(total, 8)} maxValue={8}><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar>
          <span className="text-xs">{count ? `${count} ${count === 1 ? 'entry' : 'entries'}` : isWorkingDay(day) && day <= today ? 'Not logged' : 'No entries'}</span>
        </ToggleButton>;
      })}
    </div>
  </div></div>;
}
