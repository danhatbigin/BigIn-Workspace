import { Alert, Button, Card, Description, Form, Input, Label, Spinner, TextField } from '@heroui/react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { App } from './App';
import { useSystemTheme } from './system/useSystemTheme';
import { dateKey, monthDays, type Entry, type Task } from '../../../packages/domain/time';
import type { LiveData, User } from '../../../packages/op/bridge';

const api=window.biginDesktop!;
// Only the currently mounted screen owns the theme runtime.
function SetupShell({children}:{children:ReactNode}) {useSystemTheme();return <main className="grid min-h-screen place-items-center p-6"><div className="w-full max-w-lg">{children}</div></main>;}
export default function DesktopEntry() {
  const [user,setUser]=useState<User|null>(null); const [data,setData]=useState<LiveData|null>(null);
  const [token,setToken]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(true); const [booting,setBooting]=useState(true);
  const sequence=useRef(0); const submitting=useRef(false); const range=useRef<[string,string]>([monthDays(dateKey(new Date()))[0],monthDays(dateKey(new Date())).at(-1)!]);
  const load=useCallback(async (from:string,to:string) => {
    range.current=[from,to]; const generation=++sequence.current; setBusy(true); setError('');
    const result=await api.load(from,to);
    if(sequence.current!==generation)return;
    if(result.ok)setData(result.value); else setError(result.error);
    setBusy(false);
  },[]);
  useEffect(() => { let disposed=false; api.status().then(result=> { if(disposed)return; setBooting(false); if(result.ok && result.value.connected && result.value.user) {setUser(result.value.user); void load(...range.current);} else {setBusy(false); if(!result.ok)setError(result.error);} }); return()=>{disposed=true;}; },[load]);
  async function connect(event:React.FormEvent) { event.preventDefault(); if(submitting.current)return; submitting.current=true;setBusy(true);setError(''); try {const result=await api.connect(token); if(result.ok) {setToken('');setUser(result.value);await load(...range.current);} else {setError(result.error);setBusy(false);} } finally {submitting.current=false;} }
  async function disconnect() {const result=await api.disconnect(); if(result.ok){sequence.current++;setUser(null);setData(null);setToken('');setError('');setBusy(false);}else setError(result.error);}
  const search=useCallback(async(query:string,projectId?:number):Promise<Task[]> => {const result=await api.search(query,projectId);if(!result.ok)throw Error(result.error);setData(current=>current ? {...current,snapshot:{...current.snapshot,tasks:[...new Map([...current.snapshot.tasks,...result.value].map(task=>[task.id,task])).values()]}} : current);return result.value;},[]);
  async function write(entries:Entry[]) {
    const result=await api.write(entries); if(!result.ok) return {outcomes:entries.map(entry=>({clientId:entry.id,date:entry.date,status:'failed' as const,message:result.error}))};
    const saved=result.value.outcomes.flatMap(outcome=>outcome.entry ? [outcome.entry] : []);
    setData(current=>current ? {...current,snapshot:{...current.snapshot,entries:[...new Map([...current.snapshot.entries,...saved].map(entry=>[entry.id,entry])).values()]}} : current);
    return result.value;
  }
  const resolve=useCallback(async(clientIds:string[]):Promise<number>=>{const result=await api.resolve(clientIds);if(!result.ok)throw Error(result.error);return result.value.resolved;},[]);
  if(user && data) return <App live={{data,user,busy,warning:error,load,refresh:()=>void load(...range.current),disconnect:()=>void disconnect(),search,write,resolve}} />;
  return <SetupShell><Card><Card.Header><Card.Title>{user ? 'Load your workspace' : 'Connect to BigIn OpenProject'}</Card.Title><Card.Description>{user ? `Signed in as ${user.name}` : 'Use your API token to load your own time entries and save time to OpenProject.'}</Card.Description></Card.Header><Card.Content><div className="flex flex-col gap-5">
    {booting ? <div className="flex items-center gap-3"><Spinner size="sm" /><span>Checking your saved connection…</span></div> : user ? <><p className="text-sm text-muted">{busy ? 'Loading your time entries…' : 'Your connection is saved. Try loading again.'}</p><Button isPending={busy} onPress={()=>void load(...range.current)}>Load workspace</Button><Button variant="ghost" isDisabled={busy} onPress={()=>void disconnect()}>Forget token</Button></> : <Form className="flex flex-col gap-5" onSubmit={connect}><TextField isRequired isDisabled={busy}><Label>API token</Label><Input name="api-token" type="password" placeholder="Paste your OpenProject API token" autoFocus autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={4096} value={token} onChange={event=>setToken(event.target.value)} /><Description>OpenProject → My account → Access tokens → API.</Description></TextField><p className="text-sm text-muted">Server: op.bigin.vn. Your token is encrypted on this Windows account. It is never included in the build or saved in browser storage.</p><Button type="submit" isPending={busy}>{busy ? 'Connecting…' : 'Connect and load my time'}</Button></Form>}
    {error && <Alert status="danger" role="alert"><Alert.Indicator /><Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content></Alert>}
  </div></Card.Content></Card></SetupShell>;
}
