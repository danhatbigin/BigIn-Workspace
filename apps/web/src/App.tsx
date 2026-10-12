import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domMax } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Ellipsis, HelpCircle, Layers3, Leaf, Plus, Settings2, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { addDays, dateKey, fromKey, hoursOn, isWorkingDay, monthDays, startOfWeek, summarize, type Entry } from '../../../packages/domain/time';
import { cssMotionVariables, transitionFor, usages, presets, tokens } from '../../../packages/ui/src/motion/motion.config';
import { useWorkspace } from './useWorkspace';
import { hours, longDate, shortDate } from './format';
import { Drawer } from './Drawer';
import { DuplicateDialog } from './DuplicateDialog';
import { Dialog } from './Dialog';
import { useMotionPreference } from './useMotionPreference';

export function App() {
  const [today, setToday] = useState(() => dateKey(new Date()));
  const { data, save, warning } = useWorkspace(today);
  const [anchor, setAnchor] = useState(today); const [view, setView] = useState<'week' | 'month'>('month');
  const [focusDay, setFocusDay] = useState(startOfWeek(today)); const [drawerDate, setDrawerDate] = useState<string | null>(null);
  const [source, setSource] = useState<Entry | null>(null); const [targets, setTargets] = useState<string[]>([]); const [duplicateForm, setDuplicateForm] = useState(false);
  const [draftHours, setDraftHours] = useState<Record<string, string>>({});
  const [menu, setMenu] = useState<string | null>(null); const [settings, setSettings] = useState<'motion' | 'help' | null>(null);
  const [forceReduced, setForceReduced] = useState(false); const systemReduced = useMotionPreference(); const reduced = forceReduced || systemReduced;
  const [notice, setNotice] = useState('');
  useEffect(() => { const timer = setInterval(() => setToday(dateKey(new Date())), 60_000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => { if (!(event.target as Element).closest('.entry-actions')) setMenu(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(null); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [menu]);
  const week = startOfWeek(anchor); const days = view === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(week, i)) : monthDays(anchor);
  const lead = view === 'month' ? (fromKey(days[0]).getDay() + 6) % 7 : 0;
  const eligible = days.filter(day => isWorkingDay(day) && day <= today);
  const stats = summarize(data.entries, eligible);
  const visibleEntries = data.entries.filter(entry => days.includes(entry.date));
  const logged = visibleEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const projectTotals = [...new Set(data.tasks.map(task => task.project))].map(project => ({ project, hours: visibleEntries.filter(entry => data.tasks.find(t => t.id === entry.taskId)?.project === project).reduce((sum, entry) => sum + entry.hours, 0) }));
  const selectedEntries = data.entries.filter(entry => entry.date === focusDay);
  const sourceTask = source ? data.tasks.find(task => task.id === source.taskId)! : null;
  const monthLabel = fromKey(anchor).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  function shift(amount: number) {
    if (view === 'week') setAnchor(addDays(anchor, amount * 7));
    else { const date = fromKey(anchor); date.setDate(1); date.setMonth(date.getMonth() + amount); setAnchor(dateKey(date)); }
  }
  function endDuplicate() { setSource(null); setTargets([]); setDraftHours({}); setDuplicateForm(false); }
  function selectDate(day: string) {
    if (source) {
      setTargets(current => current.includes(day) ? current.filter(d => d !== day) : [...current, day].sort());
      setDraftHours(current => { const next = { ...current }; delete next[day]; return next; });
    }
    else setFocusDay(day);
  }
  return <LazyMotion features={domMax} strict><MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
    <div className="app" data-reduced={reduced} data-today={today} style={cssMotionVariables(reduced) as CSSProperties}>
      <aside className="sidebar">
        <a className="brand" href="#main"><span className="brand-mark">b<span>i</span></span><span>BigIn<span className="brand-sub">WORKSPACE</span></span></a>
        <div className="workspace-label">YOUR EVERYDAY SPACE</div>
        <nav aria-label="Main navigation"><button className="nav-item active" onClick={() => document.getElementById('main')?.focus()}><CalendarDays size={19} /> My time <span className="nav-dot" /></button><button className="nav-item" onClick={() => setSettings('motion')}><SlidersHorizontal size={18} /> Motion</button></nav>
        <div className="sidebar-card"><div className="leaf-orbit"><Leaf size={23} /></div><strong>A little space.<br />A clearer day.</strong><p>Log your work.<br />See your effort.</p></div>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setSettings('help')}><HelpCircle size={18} /> About this preview</button><div className="profile"><div className="avatar">B</div><div><strong>Your space</strong><small>Local preview</small></div><span className="online-dot" /></div></div>
      </aside>
      <div className="workspace">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Time tracking</strong></div><div className="topbar-actions"><span className="demo-badge"><span /> Sample data</span><button className="icon-button" aria-label="Reminder status" onClick={() => setSettings('help')}><Bell size={18} /></button></div></header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading"><div><p className="eyebrow">A LITTLE REFLECTION GOES A LONG WAY</p><h1>Time for the things<br className="mobile-break" /> you have done<span>.</span></h1><p className="subtitle">A clearer view of your working day.</p></div><button className="primary" onClick={() => setDrawerDate(focusDay)} disabled={Boolean(source)}><Plus size={18} /> Add time</button></div>
          <div className="demo-note"><span className="sample-tag">PREVIEW 01</span> Sample data, stored on this device only. Not connected to OpenProject.<button className="text-button" onClick={() => setSettings('help')}>Details <ArrowUpRight size={14} /></button></div>
          {warning && <div role="alert" className="error-message">{warning}</div>}
          <section className="metrics" aria-label="Time overview">
            <div className="metric"><div className="metric-top"><span>Time logged</span><Clock3 size={18} /></div><div className="metric-value">{hours(logged)}<span>hours</span></div><p>In the {view === 'month' ? 'month' : 'week'} being viewed <ArrowUpRight size={14} /></p></div>
            <div className="metric"><div className="metric-top"><span>Days complete</span><Check size={18} /></div><div className="metric-value">{stats.completeDays}<span>/ {stats.days} days</span></div><p>At least 8 hours per day</p></div>
            <div className={`metric ${stats.missing ? 'metric-attention' : 'metric-complete'}`}><div className="metric-top"><span>Still to log</span><Layers3 size={18} /></div><div className="metric-value">{hours(stats.missing)}<span>hours</span></div><p>{stats.missing ? 'Counted per day, no offsetting' : 'All due days are complete'} <ArrowDownRight size={14} /></p></div>
          </section>
          <div className="content-grid"><section className="calendar-panel">
            <div className="calendar-toolbar"><div className="calendar-title"><h2>{view === 'month' ? monthLabel : `${shortDate(days[0])} — ${shortDate(days[6])}`}</h2><div className="button-row"><button className="icon-button" aria-label="Previous period" onClick={() => shift(-1)}><ChevronLeft size={17} /></button><button className="icon-button" aria-label="Next period" onClick={() => shift(1)}><ChevronRight size={17} /></button><button className="today-button" onClick={() => { setAnchor(today); if (!source) setFocusDay(today); }}>Today</button></div></div><div className="segmented" aria-label="Calendar view"><button aria-pressed={view === 'week'} className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Week</button><button aria-pressed={view === 'month'} className={view === 'month' ? 'selected' : ''} onClick={() => setView('month')}>Month</button></div></div>
            <AnimatePresence>{source && <m.div key="duplicate-mode" className="duplicate-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitionFor('duplicate.modeEnter', reduced)}><Copy size={19} /><div><strong>Duplicating · {targets.length} selected</strong><span>{sourceTask?.title}</span></div><div className="button-row"><button className="secondary" onClick={endDuplicate}>Cancel</button><button className="primary" disabled={!targets.length} onClick={() => setDuplicateForm(true)}>Duplicate <ChevronRight size={15} /></button></div></m.div>}</AnimatePresence>
            <div className="weekday-row">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}</div>
            <div className={`calendar-grid ${view === 'week' ? 'week-grid' : ''}`}>
              {Array.from({ length: lead }, (_, i) => <div className="calendar-day outside" key={`empty-${i}`} />)}
              {days.map(day => { const total = hoursOn(data.entries, day); const active = source ? targets.includes(day) : focusDay === day; const dayEntries = data.entries.filter(e => e.date === day); const due = isWorkingDay(day) && day <= today;
                return <button key={day} type="button" className={`calendar-day ${active ? 'day-selected' : ''} ${!isWorkingDay(day) ? 'weekend' : ''} ${day === today ? 'is-today' : ''}`} aria-label={`${source ? 'Select date' : 'View date'} ${day}`} aria-pressed={active} onClick={() => selectDate(day)}>
                  <span className="day-heading"><span className="date-number">{fromKey(day).getDate()}</span>{source && active ? <Check size={15} /> : total >= 8 ? <Check size={13} className="complete-icon" /> : day === today ? <small>Today</small> : null}</span>
                  {total > 0 ? <><span className={`day-hours ${total >= 8 ? 'enough' : ''}`}>{hours(total)}<small>h</small></span><span className="day-bars">{dayEntries.map(e => <i key={e.id} className={data.tasks.find(t => t.id === e.taskId)?.project === 'MiVida' ? 'blue' : ''} style={{ flexGrow: e.hours }} />)}</span><span className="day-caption">{dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}</span></> : <span className="day-empty">{due ? 'Not logged' : '—'}</span>}
                </button>;
              })}
            </div>
            <div className="calendar-legend"><span><i className="legend-dot green" /> VirgilHR</span><span><i className="legend-dot blue" /> MiVida</span><span className="legend-note">Sample: Mon–Fri, up to today · leave and holidays not included</span></div>
          </section>
          <aside className="reflection-panel"><div className="reflection-header"><Sparkles size={18} /><span>YOUR WORK, IN PERSPECTIVE</span></div><h2>Every piece of work<br />has its place.</h2><p>See the time you spent on each project in this period.</p><div className="allocation-chart" aria-label="Time allocation">{projectTotals.map((item, i) => <div key={item.project} className={i ? 'blue' : ''} style={{ flexGrow: item.hours || 0.001 }} />)}</div><div className="project-totals">{projectTotals.map((item, i) => <div key={item.project}><span><i className={`legend-dot ${i ? 'blue' : 'green'}`} />{item.project}</span><strong>{hours(item.hours)}<small> hours</small></strong></div>)}</div><div className="reflection-foot"><Leaf size={17} /><p>Logged hours help you look back on your work. Recognition levels will be shaped together with you.</p></div></aside></div>
          <section className="day-detail" aria-label="Day detail"><div className="detail-heading"><div><p className="eyebrow">A CLOSER LOOK</p><h2>{longDate(focusDay)}</h2></div><span className="day-total">{hours(hoursOn(data.entries, focusDay))} hours logged</span><button className="text-button" disabled={Boolean(source)} onClick={() => setDrawerDate(focusDay)}><Plus size={16} /> Add entry</button></div>
            {!selectedEntries.length && <div className="empty"><Clock3 size={23} /><p>This day is waiting to be logged.</p><button className="secondary" disabled={Boolean(source)} onClick={() => setDrawerDate(focusDay)}>Add the first entry</button></div>}
            {selectedEntries.map(entry => { const task = data.tasks.find(t => t.id === entry.taskId)!; return <div className="entry-row" key={entry.id}><div className={`entry-icon ${task.project === 'MiVida' ? 'blue' : ''}`}><Layers3 size={19} /></div><div className="entry-info"><small>{task.project}<span> / {task.id}</span></small><strong>{task.title}</strong>{entry.note && <p>{entry.note}</p>}</div><span className="status-pill">{task.status}</span><strong className="entry-hours">{hours(entry.hours)}<span> h</span></strong><div className="entry-actions"><button className="icon-button" aria-label={`Actions ${entry.id}`} aria-expanded={menu === entry.id} onClick={() => setMenu(menu === entry.id ? null : entry.id)} disabled={Boolean(source)}><Ellipsis size={20} /></button>{menu === entry.id && <div className="entry-menu"><button onClick={() => { setSource(entry); setTargets([]); setMenu(null); }}><Copy size={15} /> Duplicate</button></div>}</div></div>; })}
          </section>
          <footer className="page-footer"><span>Designed around your everyday work.</span><span>BigIn Workspace · Preview 0.1</span></footer>
        </main>
      </div>
      <AnimatePresence>{notice && <m.div role="status" className="toast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitionFor('log.saveConfirmed', reduced)}><Check size={18} /><span>{notice}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></m.div>}</AnimatePresence>
      {drawerDate && <Drawer key={drawerDate} date={drawerDate} data={data} reduced={reduced} onClose={() => setDrawerDate(null)} onSave={next => { if (!save(next)) return false; setFocusDay(drawerDate); setNotice('Time saved on this device. Thanks for looking back on your day.'); return true; }} />}
      {duplicateForm && source && sourceTask && <DuplicateDialog key={source.id + targets.join(',')} source={source} task={sourceTask} dates={targets} draftHours={draftHours} entries={data.entries} reduced={reduced} onCancel={endDuplicate} onBack={rows => { setTargets(rows.map(r => r.date)); setDraftHours(Object.fromEntries(rows.map(r => [r.date, r.hours]))); setDuplicateForm(false); }} onSave={created => { if (!save({ ...data, entries: [...data.entries, ...created] })) return false; endDuplicate(); setNotice(`Added ${created.length} entries on this device. The original entry is unchanged.`); return true; }} />}
      {settings && <Dialog titleId="settings-title" className="settings-shell" onCancel={() => setSettings(null)}><header className="dialog-header"><div><p className="eyebrow">WORKSPACE PREFERENCES</p><h2 id="settings-title">{settings === 'motion' ? 'Motion with purpose.' : 'A foundation to refine together.'}</h2></div><button className="icon-button" aria-label="Close settings" onClick={() => setSettings(null)}><X size={20} /></button></header><div className="settings-body">{settings === 'motion' ? <><div className="motion-setting"><div><h3>Reduce motion</h3><p>Follows your operating system by default. Turn on to reduce further in this session.</p></div><input aria-label="Reduce motion" type="checkbox" checked={forceReduced} onChange={e => setForceReduced(e.target.checked)} /></div><p className="hint">Current: {reduced ? 'reduced motion' : 'full motion'}. Confirmations and warnings are always kept.</p><table className="motion-table"><thead><tr><th>Usage</th><th>Preset</th><th>ms</th></tr></thead><tbody>{Object.entries(usages).map(([id, usage]) => <tr key={id}><td>{id}</td><td>{usage.preset}</td><td>{tokens.duration[presets[usage.preset].duration]}</td></tr>)}</tbody></table><p className="hint">Values are read directly from motion.config.ts. Engine: Motion + CSS.</p></> : <><div className="help-callout"><Leaf size={24} /><p>A first preview to try the time logging and duplicate flows. All data in this version is sample data, stored in the browser or desktop app on this device.</p></div><h3>Included in this version</h3><p>Week/month calendar · find or create sample tasks · log hours · duplicate across days · Remove · duplicate-task warning · Reduce motion.</p><h3>5:00 PM reminder and OpenProject connection</h3><p>Not enabled yet. The connection, leave calendar and real data need to be verified before sending notifications. Closing the desktop app currently quits it; there is no background mode for reminders yet.</p><h3>Temporary rules for this preview</h3><p>Mon–Fri up to today, 8 hours per day; leave and holidays are not counted. Hours accept decimals greater than 0 and up to 24. Recognition labels are not applied yet.</p></>}</div></Dialog>}
    </div>
  </MotionConfig></LazyMotion>;
}
