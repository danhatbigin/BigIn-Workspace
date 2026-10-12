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
  const monthLabel = fromKey(anchor).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
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
        <nav aria-label="Điều hướng chính"><button className="nav-item active" onClick={() => document.getElementById('main')?.focus()}><CalendarDays size={19} /> Thời gian của tôi <span className="nav-dot" /></button><button className="nav-item" onClick={() => setSettings('motion')}><SlidersHorizontal size={18} /> Chuyển động</button></nav>
        <div className="sidebar-card"><div className="leaf-orbit"><Leaf size={23} /></div><strong>A little space.<br />A clearer day.</strong><p>Ghi lại công việc.<br />Nhìn thấy nỗ lực.</p></div>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setSettings('help')}><HelpCircle size={18} /> Về bản trải nghiệm</button><div className="profile"><div className="avatar">B</div><div><strong>Không gian của bạn</strong><small>Local preview</small></div><span className="online-dot" /></div></div>
      </aside>
      <div className="workspace">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Time tracking</strong></div><div className="topbar-actions"><span className="demo-badge"><span /> Dữ liệu mẫu</span><button className="icon-button" aria-label="Trạng thái nhắc giờ" onClick={() => setSettings('help')}><Bell size={18} /></button></div></header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading"><div><p className="eyebrow">A LITTLE REFLECTION GOES A LONG WAY</p><h1>Thời gian cho những điều<br className="mobile-break" /> bạn đã làm<span>.</span></h1><p className="subtitle">Một góc nhìn rõ hơn về ngày làm việc của bạn.</p></div><button className="primary" onClick={() => setDrawerDate(focusDay)} disabled={Boolean(source)}><Plus size={18} /> Thêm thời gian</button></div>
          <div className="demo-note"><span className="sample-tag">PREVIEW 01</span> Dữ liệu minh họa, chỉ lưu trên máy. Chưa kết nối OpenProject.<button className="text-button" onClick={() => setSettings('help')}>Chi tiết <ArrowUpRight size={14} /></button></div>
          {warning && <div role="alert" className="error-message">{warning}</div>}
          <section className="metrics" aria-label="Tổng quan thời gian">
            <div className="metric"><div className="metric-top"><span>Thời gian đã ghi nhận</span><Clock3 size={18} /></div><div className="metric-value">{hours(logged)}<span>giờ</span></div><p>Trong {view === 'month' ? 'tháng' : 'tuần'} đang xem <ArrowUpRight size={14} /></p></div>
            <div className="metric"><div className="metric-top"><span>Ngày đã đủ giờ</span><Check size={18} /></div><div className="metric-value">{stats.completeDays}<span>/ {stats.days} ngày</span></div><p>Tối thiểu 8 giờ mỗi ngày</p></div>
            <div className={`metric ${stats.missing ? 'metric-attention' : 'metric-complete'}`}><div className="metric-top"><span>Còn cần bổ sung</span><Layers3 size={18} /></div><div className="metric-value">{hours(stats.missing)}<span>giờ</span></div><p>{stats.missing ? 'Tính riêng từng ngày, không bù giờ' : 'Các ngày đến hạn đã đủ giờ'} <ArrowDownRight size={14} /></p></div>
          </section>
          <div className="content-grid"><section className="calendar-panel">
            <div className="calendar-toolbar"><div className="calendar-title"><h2>{view === 'month' ? monthLabel : `${shortDate(days[0])} — ${shortDate(days[6])}`}</h2><div className="button-row"><button className="icon-button" aria-label="Kỳ trước" onClick={() => shift(-1)}><ChevronLeft size={17} /></button><button className="icon-button" aria-label="Kỳ sau" onClick={() => shift(1)}><ChevronRight size={17} /></button><button className="today-button" onClick={() => { setAnchor(today); if (!source) setFocusDay(today); }}>Hôm nay</button></div></div><div className="segmented" aria-label="Chế độ lịch"><button aria-pressed={view === 'week'} className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Tuần</button><button aria-pressed={view === 'month'} className={view === 'month' ? 'selected' : ''} onClick={() => setView('month')}>Tháng</button></div></div>
            <AnimatePresence>{source && <m.div key="duplicate-mode" className="duplicate-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitionFor('duplicate.modeEnter', reduced)}><Copy size={19} /><div><strong>Đang duplicate · {targets.length} ngày đã chọn</strong><span>{sourceTask?.title}</span></div><div className="button-row"><button className="secondary" onClick={endDuplicate}>Cancel</button><button className="primary" disabled={!targets.length} onClick={() => setDuplicateForm(true)}>Duplicate <ChevronRight size={15} /></button></div></m.div>}</AnimatePresence>
            <div className="weekday-row">{['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(day => <span key={day}>{day}</span>)}</div>
            <div className={`calendar-grid ${view === 'week' ? 'week-grid' : ''}`}>
              {Array.from({ length: lead }, (_, i) => <div className="calendar-day outside" key={`empty-${i}`} />)}
              {days.map(day => { const total = hoursOn(data.entries, day); const active = source ? targets.includes(day) : focusDay === day; const dayEntries = data.entries.filter(e => e.date === day); const due = isWorkingDay(day) && day <= today;
                return <button key={day} type="button" className={`calendar-day ${active ? 'day-selected' : ''} ${!isWorkingDay(day) ? 'weekend' : ''} ${day === today ? 'is-today' : ''}`} aria-label={`${source ? 'Chọn ngày' : 'Xem ngày'} ${day}`} aria-pressed={active} onClick={() => selectDate(day)}>
                  <span className="day-heading"><span className="date-number">{fromKey(day).getDate()}</span>{source && active ? <Check size={15} /> : total >= 8 ? <Check size={13} className="complete-icon" /> : day === today ? <small>Hôm nay</small> : null}</span>
                  {total > 0 ? <><span className={`day-hours ${total >= 8 ? 'enough' : ''}`}>{hours(total)}<small>h</small></span><span className="day-bars">{dayEntries.map(e => <i key={e.id} className={data.tasks.find(t => t.id === e.taskId)?.project === 'MiVida' ? 'blue' : ''} style={{ flexGrow: e.hours }} />)}</span><span className="day-caption">{dayEntries.length} {view === 'week' ? 'time entries' : 'entries'}</span></> : <span className="day-empty">{due ? 'Chưa ghi nhận' : '—'}</span>}
                </button>;
              })}
            </div>
            <div className="calendar-legend"><span><i className="legend-dot green" /> VirgilHR</span><span><i className="legend-dot blue" /> MiVida</span><span className="legend-note">Mẫu: T2–T6, tính đến hôm nay · chưa gồm phép/lễ</span></div>
          </section>
          <aside className="reflection-panel"><div className="reflection-header"><Sparkles size={18} /><span>YOUR WORK, IN PERSPECTIVE</span></div><h2>Mỗi phần việc<br />đều có một chỗ.</h2><p>Nhìn lại thời gian bạn đã dành cho các project trong kỳ này.</p><div className="allocation-chart" aria-label="Phân bổ thời gian">{projectTotals.map((item, i) => <div key={item.project} className={i ? 'blue' : ''} style={{ flexGrow: item.hours || 0.001 }} />)}</div><div className="project-totals">{projectTotals.map((item, i) => <div key={item.project}><span><i className={`legend-dot ${i ? 'blue' : 'green'}`} />{item.project}</span><strong>{hours(item.hours)}<small> giờ</small></strong></div>)}</div><div className="reflection-foot"><Leaf size={17} /><p>Giờ đã ghi nhận giúp bạn nhìn lại công việc. Các mức khen thưởng sẽ được hoàn thiện cùng bạn.</p></div></aside></div>
          <section className="day-detail" aria-label="Chi tiết ngày"><div className="detail-heading"><div><p className="eyebrow">A CLOSER LOOK</p><h2>{longDate(focusDay)}</h2></div><span className="day-total">{hours(hoursOn(data.entries, focusDay))} giờ đã ghi nhận</span><button className="text-button" disabled={Boolean(source)} onClick={() => setDrawerDate(focusDay)}><Plus size={16} /> Thêm entry</button></div>
            {!selectedEntries.length && <div className="empty"><Clock3 size={23} /><p>Một ngày đang chờ được ghi lại.</p><button className="secondary" disabled={Boolean(source)} onClick={() => setDrawerDate(focusDay)}>Thêm thời gian đầu tiên</button></div>}
            {selectedEntries.map(entry => { const task = data.tasks.find(t => t.id === entry.taskId)!; return <div className="entry-row" key={entry.id}><div className={`entry-icon ${task.project === 'MiVida' ? 'blue' : ''}`}><Layers3 size={19} /></div><div className="entry-info"><small>{task.project}<span> / {task.id}</span></small><strong>{task.title}</strong>{entry.note && <p>{entry.note}</p>}</div><span className="status-pill">{task.status}</span><strong className="entry-hours">{hours(entry.hours)}<span> h</span></strong><div className="entry-actions"><button className="icon-button" aria-label={`Thao tác ${entry.id}`} aria-expanded={menu === entry.id} onClick={() => setMenu(menu === entry.id ? null : entry.id)} disabled={Boolean(source)}><Ellipsis size={20} /></button>{menu === entry.id && <div className="entry-menu"><button onClick={() => { setSource(entry); setTargets([]); setMenu(null); }}><Copy size={15} /> Duplicate</button></div>}</div></div>; })}
          </section>
          <footer className="page-footer"><span>Designed around your everyday work.</span><span>BigIn Workspace · Preview 0.1</span></footer>
        </main>
      </div>
      <AnimatePresence>{notice && <m.div role="status" className="toast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitionFor('log.saveConfirmed', reduced)}><Check size={18} /><span>{notice}</span><button className="icon-button" aria-label="Đóng thông báo" onClick={() => setNotice('')}><X size={16} /></button></m.div>}</AnimatePresence>
      {drawerDate && <Drawer key={drawerDate} date={drawerDate} data={data} reduced={reduced} onClose={() => setDrawerDate(null)} onSave={next => { if (!save(next)) return false; setFocusDay(drawerDate); setNotice('Đã lưu thời gian trên máy. Cảm ơn bạn đã nhìn lại ngày làm việc.'); return true; }} />}
      {duplicateForm && source && sourceTask && <DuplicateDialog key={source.id + targets.join(',')} source={source} task={sourceTask} dates={targets} draftHours={draftHours} entries={data.entries} reduced={reduced} onCancel={endDuplicate} onBack={rows => { setTargets(rows.map(r => r.date)); setDraftHours(Object.fromEntries(rows.map(r => [r.date, r.hours]))); setDuplicateForm(false); }} onSave={created => { if (!save({ ...data, entries: [...data.entries, ...created] })) return false; endDuplicate(); setNotice(`Đã thêm ${created.length} entries trên máy. Entry gốc được giữ nguyên.`); return true; }} />}
      {settings && <Dialog titleId="settings-title" className="settings-shell" onCancel={() => setSettings(null)}><header className="dialog-header"><div><p className="eyebrow">WORKSPACE PREFERENCES</p><h2 id="settings-title">{settings === 'motion' ? 'Chuyển động có chủ đích.' : 'Một nền tảng để cùng hoàn thiện.'}</h2></div><button className="icon-button" aria-label="Đóng cài đặt" onClick={() => setSettings(null)}><X size={20} /></button></header><div className="settings-body">{settings === 'motion' ? <><div className="motion-setting"><div><h3>Giảm chuyển động</h3><p>Mặc định theo hệ điều hành. Bật để giảm thêm trong phiên này.</p></div><input aria-label="Giảm chuyển động" type="checkbox" checked={forceReduced} onChange={e => setForceReduced(e.target.checked)} /></div><p className="hint">Hiện tại: {reduced ? 'giảm chuyển động' : 'đầy đủ'}. Dấu xác nhận và cảnh báo luôn được giữ lại.</p><table className="motion-table"><thead><tr><th>Vị trí sử dụng</th><th>Preset</th><th>ms</th></tr></thead><tbody>{Object.entries(usages).map(([id, usage]) => <tr key={id}><td>{id}</td><td>{usage.preset}</td><td>{tokens.duration[presets[usage.preset].duration]}</td></tr>)}</tbody></table><p className="hint">Số liệu đọc trực tiếp từ motion.config.ts. Engine: Motion + CSS.</p></> : <><div className="help-callout"><Leaf size={24} /><p>Bản đầu để anh trải nghiệm luồng log time và duplicate. Mọi dữ liệu trong bản này là dữ liệu mẫu, lưu tại trình duyệt hoặc desktop trên máy.</p></div><h3>Đã có trong bản này</h3><p>Lịch tuần/tháng · tìm/tạo task mẫu · log giờ · duplicate nhiều ngày · Remove · cảnh báo task trùng · Reduce Motion.</p><h3>Nhắc 17:00 và kết nối OP</h3><p>Chưa bật. Cần xác minh kết nối, lịch nghỉ và dữ liệu thật trước khi gửi notification. Đóng desktop hiện sẽ thoát app, chưa có chế độ chạy nền nhắc giờ.</p><h3>Quy tắc tạm dùng để trải nghiệm</h3><p>T2–T6 đến hôm nay, mỗi ngày 8 giờ; chưa tính phép/lễ. Ô giờ nhận số thập phân lớn hơn 0 và tối đa 24. Nhãn khen thưởng chưa áp dụng.</p></>}</div></Dialog>}
    </div>
  </MotionConfig></LazyMotion>;
}
