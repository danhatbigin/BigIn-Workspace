const { safeStorage } = require('electron');
const { readFile, writeFile, rename, unlink, mkdir } = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { createLiveClient, WriteError } = require('./live.cjs');

function createService(userData, server) {
  const credentialsPath=path.join(userData,'op-credentials.bin');
  const journalPath=path.join(userData,'op-write-journal.json');
  let client, user, busy=false; let journal=[];
  const fingerprint = entry => createHash('sha256').update(JSON.stringify([server,user?.id,entry.taskId,entry.date,entry.hours,entry.note,entry.activityId])).digest('hex');
  const slotOf = entry => createHash('sha256').update(JSON.stringify([server,user?.id,entry.taskId,entry.date])).digest('hex');
  async function persistJournal() { await writeFile(journalPath+'.tmp',JSON.stringify(journal),'utf8'); await rename(journalPath+'.tmp',journalPath); }
  async function start() {
    try { journal=JSON.parse(await readFile(journalPath,'utf8')); if (!Array.isArray(journal)) throw Error(); } catch(error) { if(error.code==='ENOENT') journal=[]; else throw Error('The save journal could not be read. Restore it before writing time.'); }
    // A process interruption during a POST is treated as uncertain on restart.
    if (journal.some(item=>item.status==='sending')) { journal=journal.map(item=>item.status==='sending' ? {...item,status:'uncertain'} : item); await persistJournal(); }
    try { const encrypted=await readFile(credentialsPath); if (!safeStorage.isEncryptionAvailable()) throw Error(); const token=safeStorage.decryptString(encrypted); client=createLiveClient({baseUrl:server,apiKey:token}); } catch { client=undefined; }
  }
  async function status() { if (!client) return {connected:false,server}; try { user=await client.me(); return {connected:true,user,server}; } catch(error) { if(error.kind==='unauthorized') {client=undefined; return {connected:false,server};} throw error; } }
  async function connect(token) {
    if (busy || typeof token!=='string' || !token.trim() || token.length>4096 || /[\r\n]/.test(token)) throw Error('Enter a valid API token.');
    if (!safeStorage.isEncryptionAvailable()) throw Error('Windows credential encryption is unavailable. The token has not been saved.');
    busy=true;
    try { const candidate=createLiveClient({baseUrl:server,apiKey:token.trim()}); const account=await candidate.me(); await mkdir(userData,{recursive:true}); await writeFile(credentialsPath+'.tmp',safeStorage.encryptString(token.trim())); await rename(credentialsPath+'.tmp',credentialsPath); client=candidate; user=account; return user; } finally {busy=false;}
  }
  async function disconnect() { if(busy) throw Error('Wait for the current save to finish.'); client=undefined; user=undefined; try {await unlink(credentialsPath);} catch(error){if(error.code!=='ENOENT')throw Error('Could not remove the saved token.');} return null; }
  // Owner confirms in OpenProject that the uncertain entry was or was not saved; this only lifts the retry block.
  async function resolve(clientIds) {
    if (busy) throw Error('Wait for the current save to finish.');
    if(!Array.isArray(clientIds)||!clientIds.length||clientIds.length>31||clientIds.some(id=>typeof id!=='string'||id.length>100)) throw Error('Invalid request.');
    const active=requireClient(); if(!user)user=await active.me();
    let resolved=0; const stamp=new Date().toISOString();
    for(const item of journal) if(item.userId===user.id && item.status==='uncertain' && clientIds.includes(item.clientId)) {item.status='resolved';item.resolvedAt=stamp;resolved++;}
    if(resolved) await persistJournal();
    return {resolved};
  }
  function requireClient() {if(!client) throw Error('Connect to OpenProject first.'); return client;}
  async function write(entries) {
    if (busy) throw Error('Another save is still running.');
    if(!Array.isArray(entries)||!entries.length||entries.length>31 || new Set(entries.map(entry=>entry?.id)).size!==entries.length) throw Error('Choose between 1 and 31 unique entries.');
    const active=requireClient(); busy=true; const outcomes=[];
    try {
      if(!user)user=await active.me();
      for (const entry of entries) {
        if(!entry || typeof entry.id!=='string' || typeof entry.taskId!=='string' || typeof entry.note!=='string') throw Error('Invalid time entry.');
        const key=fingerprint(entry);
        const previous=journal.find(item=>item.userId===user.id && item.clientId===entry.id && item.status==='saved');
        const slot=slotOf(entry);
        // An unresolved attempt blocks the same task+day even if hours or note were edited, so editing cannot bypass the guard.
        const unresolved=journal.find(item=>(item.key===key || item.slot===slot) && ['sending','uncertain'].includes(item.status));
        if(previous?.status==='saved') { outcomes.push({...previous.outcome,clientId:entry.id}); continue; }
        if(unresolved) { outcomes.push({clientId:entry.id,date:entry.date,status:'uncertain',message:'An earlier save has an unknown result. Check this day in OpenProject; automatic retry is blocked.'}); continue; }
        const record={key,slot,userId:user.id,clientId:entry.id,status:'sending',date:entry.date}; journal.push(record); await persistJournal();
        let outcome;
        try { const saved=await active.create(entry); outcome={clientId:entry.id,date:entry.date,status:'saved',entry:saved,message:'Saved to OpenProject.'}; }
        catch(error) { outcome={clientId:entry.id,date:entry.date,status:error instanceof WriteError && error.uncertain ? 'uncertain' : 'failed',message:error.message || 'Could not save time.'}; }
        record.status=outcome.status; record.outcome=outcome;
        try { await persistJournal(); } catch { record.status='uncertain'; outcome={clientId:entry.id,date:entry.date,status:'uncertain',message:'Save journal could not be updated. Check OpenProject before trying again.'}; }
        outcomes.push(outcome);
      }
      return {outcomes};
    } finally {busy=false;}
  }
  return {start,status,connect,disconnect,load:(from,to)=>requireClient().load(from,to),search:(query,projectId)=>requireClient().search(query,projectId),write,resolve};
}
module.exports={createService};

