import { addDays, startOfWeek, type Snapshot } from './time';
export function demoSnapshot(today: string): Snapshot {
  const week = startOfWeek(today);
  return { version: 1, tasks: [
    { id: 'VHR-124', project: 'VirgilHR', title: 'Requirement analysis & team guidance', status: 'In progress' },
    { id: 'MV-208', project: 'MiVida', title: 'Patient portal · Appointment experience', status: 'In progress' },
    { id: 'MV-196', project: 'MiVida', title: 'Sprint 12 · Mobile & CMS', status: 'To do' },
    { id: 'VHR-118', project: 'VirgilHR', title: 'Client review & feedback', status: 'Done' },
  ], entries: [
    { id: 'sample-1', taskId: 'VHR-124', date: week, hours: 4, note: 'Requirement analysis and team guidance' },
    { id: 'sample-2', taskId: 'MV-208', date: week, hours: 2, note: 'Reviewed the appointment booking experience' },
    { id: 'sample-3', taskId: 'VHR-124', date: addDays(week, -7), hours: 6, note: '' },
    { id: 'sample-4', taskId: 'MV-208', date: addDays(week, -6), hours: 10, note: '' },
    { id: 'sample-5', taskId: 'VHR-118', date: addDays(week, -5), hours: 8, note: '' },
    { id: 'sample-6', taskId: 'MV-196', date: addDays(week, -4), hours: 8, note: '' },
    { id: 'sample-7', taskId: 'MV-208', date: addDays(week, -3), hours: 8, note: '' },
  ] };
}
