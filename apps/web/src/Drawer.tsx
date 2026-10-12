import { useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowLeft, Check, Plus, Search, X } from 'lucide-react';
import { Dialog } from './Dialog';
import { longDate } from './format';
import { validHours, type Entry, type Snapshot, type Task } from '../../../packages/domain/time';
import { transitionFor } from '../../../packages/ui/src/motion/motion.config';

export function Drawer({ date, data, reduced, onSave, onClose }: {
  date: string; data: Snapshot; reduced: boolean; onSave: (next: Snapshot) => boolean; onClose: () => void;
}) {
  const [project, setProject] = useState('All'); const [query, setQuery] = useState('');
  const [task, setTask] = useState<Task | null>(null); const [duration, setDuration] = useState('');
  const [note, setNote] = useState(''); const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState(''); const [newProject, setNewProject] = useState('VirgilHR');
  const [open, setOpen] = useState(true); const [discard, setDiscard] = useState(false); const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const submitting = useRef(false);
  const dirty = duration !== '' || note !== '' || newTitle !== '' || (task !== null && (created || data.tasks.find(t => t.id === task.id)?.status !== task.status));
  const requestClose = () => dirty ? setDiscard(true) : setOpen(false);
  const projects = [...new Set(data.tasks.map(t => t.project))];
  const filtered = data.tasks.filter(t => (project === 'All' || t.project === project) && `${t.id} ${t.title}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  function submit(event: React.FormEvent) {
    event.preventDefault(); if (submitting.current) return;
    if (!task || !validHours(duration)) { setError('Nhập số giờ lớn hơn 0 và không quá 24.'); return; }
    submitting.current = true;
    const entry: Entry = { id: crypto.randomUUID(), taskId: task.id, date, hours: Number(duration), note };
    const tasks = created ? [...data.tasks, task] : data.tasks.map(t => t.id === task.id ? task : t);
    if (onSave({ ...data, tasks, entries: [...data.entries, entry] })) { setOpen(false); }
    else { submitting.current = false; setError('Chưa lưu được trên máy. Thông tin của bạn vẫn ở đây.'); }
  }
  return <Dialog titleId="drawer-title" className="drawer-shell" onCancel={requestClose}>
    <AnimatePresence onExitComplete={onClose}>
      {open && <m.section key="drawer" className="drawer" initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : 24, transition: transitionFor('logDrawer.exit', reduced) }} transition={transitionFor('logDrawer.enter', reduced)}>
        <header className="dialog-header"><div><p className="eyebrow">MAKE ROOM FOR YOUR WORK</p><h2 id="drawer-title">Thêm thời gian</h2><p className="muted">{longDate(date)}</p></div><button className="icon-button" aria-label="Đóng drawer" onClick={requestClose}><X size={20} /></button></header>
        <div className="drawer-body">
          <div className="step-indicator"><span className={task ? 'done' : 'active'}>1 <span>Chọn công việc</span></span><i /><span className={task ? 'active' : ''}>2 <span>Ghi nhận thời gian</span></span></div>
          {!task && !creating && <>
            <label className="field-label" htmlFor="project-filter">Project</label><select id="project-filter" value={project} onChange={e => setProject(e.target.value)}><option value="All">Tất cả project</option>{projects.map(p => <option key={p}>{p}</option>)}</select>
            <div className="search-field"><Search size={18} /><input autoFocus aria-label="Tìm task" placeholder="Tìm theo tên hoặc mã công việc…" value={query} onChange={e => setQuery(e.target.value)} /></div>
            <div className="result-label"><span>{filtered.length} công việc</span><span>{project === 'All' ? 'Tất cả project' : project}</span></div>
            <div className="task-list">{filtered.map(t => <button key={t.id} className="task-option" onClick={() => { setTask({ ...t }); setCreated(false); }}><span className={`project-dot ${t.project === 'MiVida' ? 'blue' : ''}`} /><span><small>{t.project} <span>· {t.id}</span></small><strong>{t.title}</strong><em>{t.status}</em></span><span className="task-arrow">↗</span></button>)}</div>
            {filtered.length === 0 && <p className="empty">Chưa tìm thấy task trong phạm vi này.</p>}
            <button className="create-task" onClick={() => { setCreating(true); setNewProject(project === 'All' ? projects[0] : project); }}><Plus size={18} /> Tạo task mới trong bản mẫu</button>
          </>}
          {creating && !task && <form onSubmit={e => { e.preventDefault(); if (!newTitle.trim()) return; setTask({ id: `LOCAL-${crypto.randomUUID().slice(0, 6)}`, project: newProject, title: newTitle.trim(), status: 'To do' }); setCreated(true); setCreating(false); }}>
            <button type="button" className="text-button" onClick={() => setCreating(false)}><ArrowLeft size={16} /> Quay lại danh sách</button>
            <label className="field-label" htmlFor="new-title">Tên công việc</label><input id="new-title" autoFocus required maxLength={200} value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <label className="field-label" htmlFor="new-project">Project</label><select id="new-project" value={newProject} onChange={e => setNewProject(e.target.value)}>{projects.map(p => <option key={p}>{p}</option>)}</select>
            <p className="hint">Task chỉ được lưu cùng time entry khi bạn hoàn tất.</p><button className="primary" type="submit">Tiếp tục <span>→</span></button>
          </form>}
          {task && <form id="log-form" onSubmit={submit}>
            <button type="button" className="text-button" onClick={() => { setTask(null); setCreated(false); }}><ArrowLeft size={16} /> Chọn công việc khác</button>
            <div className="selected-task"><small>{task.project} · {task.id}</small><h3>{task.title}</h3></div>
            <label className="field-label" htmlFor="log-hours">Bạn đã dành bao nhiêu giờ?</label><div className="hours-input"><input id="log-hours" autoFocus type="number" inputMode="decimal" min="0.01" max="24" step="any" required placeholder="0" value={duration} onChange={e => setDuration(e.target.value)} /><span>giờ</span></div>
            <p className="hint">Một khoảng dừng để nhìn lại công việc bạn đã làm.</p>
            <label className="field-label" htmlFor="log-note">Ghi chú <span>· không bắt buộc</span></label><textarea id="log-note" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Bạn đã làm gì trong khoảng thời gian này?" />
            <label className="field-label" htmlFor="task-status">Trạng thái task</label><select id="task-status" value={task.status} onChange={e => setTask({ ...task, status: e.target.value as Task['status'] })}><option>To do</option><option>In progress</option><option>Done</option></select>
            {error && <p role="alert" className="error-message">{error}</p>}
          </form>}
        </div>
        {discard && <div className="discard-prompt" role="alert"><p>Bỏ phần đang nhập và đóng?</p><button className="secondary" onClick={() => setDiscard(false)}>Tiếp tục nhập</button><button className="text-button" onClick={() => setOpen(false)}>Bỏ bản nháp</button></div>}
        <footer className="dialog-footer"><span className="local-note">Dữ liệu mẫu · lưu trên máy</span>{task && <button form="log-form" type="submit" className="primary"><Check size={17} /> Lưu thời gian</button>}</footer>
      </m.section>}
    </AnimatePresence>
  </Dialog>;
}
