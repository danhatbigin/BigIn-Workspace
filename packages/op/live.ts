import { createOpClient, type OpConfig } from './client';
import { OpError } from './errors';
import { parseIsoDuration } from './duration';
import { validHours, type Entry, type Task } from '../domain/time';
import type { LiveData, User } from './bridge';

const idOf = (href:unknown) => typeof href === 'string' && /\/\d+$/.test(href) ? Number(href.split('/').at(-1)) : null;
const validDate = (date:string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date+'T12:00:00Z').toISOString().slice(0,10) === date;
export class WriteError extends Error { constructor(public uncertain:boolean, message:string) { super(message); } }
/** Main-only adapter. No HTML from OP is rendered; all payloads are plain text. */
export function createLiveClient(config:OpConfig) {
  const client = createOpClient(config); const tasks = new Map<string,Task>();
  let user:User;
  async function me() { const raw = await client.requestJson('/api/v3/users/me'); if (!Number.isInteger(raw.id) || raw.id <= 0) throw new OpError('bad_response'); user={id:raw.id,name:typeof raw.name === 'string' ? raw.name : `User ${raw.id}`}; return user; }
  function taskFrom(raw:Record<string,any>):Task {
    if (!Number.isInteger(raw.id) || raw.id <= 0 || typeof raw.subject !== 'string') throw new OpError('bad_response');
    const status=String(raw._links?.status?.title ?? 'Unknown');
    const task:Task={id:String(raw.id),title:raw.subject,project:String(raw._links?.project?.title ?? 'Unknown project'),projectId:idOf(raw._links?.project?.href) ?? undefined,status:'In progress',opStatus:status,canLog:Boolean(raw._links?.logTime)};
    tasks.set(task.id,task); return task;
  }
  async function getTask(id:string) { if (!/^\d+$/.test(id)) throw new OpError('invalid_config'); return taskFrom(await client.requestJson(`/api/v3/work_packages/${id}`)); }
  async function search(query:string,projectId?:number):Promise<Task[]> {
    if (typeof query !== 'string' || query.length > 200 || (projectId !== undefined && (!Number.isInteger(projectId)||projectId<=0))) throw new OpError('invalid_config');
    if (/^#?\d+$/.test(query.trim())) return [await getTask(query.trim().replace('#',''))];
    const filters:any[] = query.trim() ? [{subjectOrId:{operator:'**',values:[query.trim()]}}] : [];
    if (projectId) filters.push({project:{operator:'=',values:[String(projectId)]}});
    const raw = await client.requestJson(`/api/v3/work_packages?pageSize=100&offset=1&filters=${encodeURIComponent(JSON.stringify(filters))}&sortBy=${encodeURIComponent(JSON.stringify([['updatedAt','desc']]))}`);
    if (!Array.isArray(raw._embedded?.elements)) throw new OpError('bad_response');
    return raw._embedded.elements.map(taskFrom);
  }
  async function load(from:string,to:string):Promise<LiveData> {
    const result=await client.getMyTimeEntries(from,to); const warnings:string[]=[];
    const taskIds=[...new Set(result.entries.flatMap(entry => entry.workPackageId ? [String(entry.workPackageId)] : []))];
    for (let i=0;i<taskIds.length;i+=4) await Promise.all(taskIds.slice(i,i+4).map(async id => { try { await getTask(id); } catch { tasks.set(id,{id,title:`Work package #${id} (details unavailable)`,project:'Unavailable project',status:'In progress',canLog:false}); warnings.push('Some work package details are unavailable.'); } }));
    const entries:Entry[]=result.entries.map(entry => { const taskId=entry.workPackageId ? String(entry.workPackageId) : `project-${entry.projectId ?? 'unknown'}`; if (!tasks.has(taskId)) tasks.set(taskId,{id:taskId,title:'Project time (no work package)',project:`Project #${entry.projectId ?? 'unknown'}`,status:'In progress',canLog:false}); return {id:String(entry.id),taskId,date:entry.date,hours:entry.hours,note:entry.note ?? '',activityId:entry.activityId}; });
    return {snapshot:{version:1,tasks:[...tasks.values()],entries},partial:result.status==='partial',warning:[result.error?.message,...new Set(warnings)].filter(Boolean).join(' '),from,to};
  }
  async function create(entry:Entry):Promise<Entry> {
    if (!entry || !/^[\w-]{1,100}$/.test(entry.id) || !/^\d+$/.test(entry.taskId) || !validDate(entry.date) || !validHours(String(entry.hours)) || typeof entry.note !== 'string' || entry.note.length > 10_000) throw new WriteError(false,'Invalid time entry.');
    if (!user) await me();
    const wp=await client.requestJson(`/api/v3/work_packages/${entry.taskId}`);
    if (!wp._links?.logTime) throw new WriteError(false,'You do not have permission to log time on this work package.');
    // Log for the authenticated user by default. Older OP instances reject an
    // explicit user link when this field is not writable for the caller.
    const payload:any = {spentOn:entry.date,hours:`PT${Math.round(entry.hours*3600)}S`,comment:{format:'plain',raw:entry.note},_links:{workPackage:{href:`/api/v3/work_packages/${entry.taskId}`}}};
    if (entry.activityId && Number.isInteger(entry.activityId) && entry.activityId>0) payload._links.activity={href:`/api/v3/time_entries/activities/${entry.activityId}`};
    const form=await client.requestJson('/api/v3/time_entries/form','POST',payload);
    const embedded=form._embedded; if (!embedded?.payload || !embedded?.schema) throw new WriteError(false,'OpenProject did not provide a valid time entry form.');
    function checkOwnUser(formPayload:any) {
      const href=formPayload?._links?.user?.href;
      if (href != null && href !== '/api/v3/users/me' && idOf(href)!==user.id) throw new WriteError(false,'OpenProject selected a different user. This app only logs time for your own account.');
    }
    checkOwnUser(embedded.payload);
    // Only opt into explicit assignment when OP says it is writable AND needs it.
    if (embedded.schema.user?.writable === true && embedded.validationErrors?.user) payload._links.user={href:`/api/v3/users/${user.id}`};
    const activity=embedded.payload._links?.activity?.href;
    const allowed=embedded.schema.activity?.allowedValues;
    if (typeof activity === 'string' && /^\/api\/v3\/time_entries\/activities\/\d+$/.test(activity)) payload._links.activity={href:activity};
    else if (Array.isArray(allowed) && allowed.length === 1) { const href=allowed[0]._links?.self?.href; if (typeof href === 'string' && /^\/api\/v3\/time_entries\/activities\/\d+$/.test(href)) payload._links.activity={href}; }
    if (!payload._links.activity) throw new WriteError(false,'This project has no default time activity. Choose a default activity in OpenProject before logging here.');
    const validated=await client.requestJson('/api/v3/time_entries/form','POST',payload);
    const errors=validated._embedded?.validationErrors;
    if (!validated._embedded?.payload || !errors || typeof errors !== 'object') throw new WriteError(false,'OpenProject did not return form validation.');
    checkOwnUser(validated._embedded.payload);
    if (Object.keys(errors).length) {
      const fields=Object.keys(errors).filter(key=>/^[a-zA-Z0-9_]+$/.test(key));
      const details=fields.flatMap(key=>typeof errors[key]?.message==='string' ? [`${key}: ${errors[key].message}`] : []);
      const safeDetails=details.join(' ').replaceAll(config.apiKey,'[redacted]').replaceAll(Buffer.from(`apikey:${config.apiKey}`).toString('base64'),'[redacted]').replace(/[\r\n]/g,' ').slice(0,500);
      throw new WriteError(false,`OpenProject needs valid fields: ${fields.join(', ') || 'entry data'}.${safeDetails ? ` ${safeDetails}` : ''}`);
    }
    // After this POST starts, a lost/invalid response is uncertain, never an automatic retry.
    try {
      const raw=await client.requestJson('/api/v3/time_entries','POST',payload);
      if (!Number.isInteger(raw.id) || raw.id<=0 || raw.spentOn!==entry.date || idOf(raw._links?.user?.href)!==user.id || idOf(raw._links?.workPackage?.href)!==Number(entry.taskId) || Math.abs(parseIsoDuration(raw.hours)-entry.hours)>.0003) throw new WriteError(true,'OpenProject may have saved this entry, but the response could not be verified. Refresh and check OpenProject before trying again.');
      return {...entry,id:String(raw.id),hours:parseIsoDuration(raw.hours),note:typeof raw.comment?.raw==='string' ? raw.comment.raw : entry.note};
    } catch(error) {
      if (error instanceof WriteError) throw error;
      const uncertain=!(error instanceof OpError) || ['network','timeout','bad_response','empty_body','server'].includes(error.kind);
      throw new WriteError(uncertain,uncertain ? 'Save result is unknown. Check OpenProject; this entry will not be retried automatically.' : (error as OpError).message);
    }
  }
  return {me,load,search,create};
}

