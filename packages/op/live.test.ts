import { describe,it,expect } from 'vitest';
import { createLiveClient,WriteError } from './live';
const entry={id:'draft-1',taskId:'42',date:'2026-10-12',hours:1.5,note:'Review'};
const wp={id:42,subject:'Pilot task',_links:{project:{href:'/api/v3/projects/5',title:'Bigin'},status:{title:'In progress'},logTime:{href:'/api/v3/time_entries/form'}}};
function mock(mode='ok') {
  const writes:any[]=[];
  const fetchImpl:typeof fetch=async(url,init)=>{
    const path=new URL(String(url)).pathname; const payload=init?.body ? JSON.parse(String(init.body)):null;
    if(path.endsWith('/users/me'))return Response.json({id:7,name:'Pilot'});
    if(path.endsWith('/work_packages/42'))return Response.json(mode==='denied'?{...wp,_links:{project:wp._links.project}}:wp);
    if(path.endsWith('/time_entries/form')) {
      const needsExplicit=mode==='user-required';
      const errors=mode==='invalid' ? {hours:{}} : needsExplicit && !payload._links.user ? {user:{errorIdentifier:'Missing'}} : !needsExplicit && payload._links.user ? {user:{errorIdentifier:'Readonly'}} : {};
      return Response.json({_embedded:{payload:{...payload,_links:{...payload._links,activity:{href:'/api/v3/time_entries/activities/3'},user:needsExplicit && !payload._links.user ? {href:null} : {href:mode==='foreign-form' ? '/api/v3/users/8' : '/api/v3/users/7'}}},schema:{activity:{},user:{writable:needsExplicit}},validationErrors:errors}});
    }
    if(path.endsWith('/time_entries')) {writes.push(payload);if(mode==='timeout')throw new DOMException('secret','TimeoutError');if(mode==='rejected')return new Response('',{status:403});if(mode!=='user-required' && payload._links.user)return new Response('',{status:422});return Response.json({id:501,spentOn:payload.spentOn,hours:payload.hours,_links:{...payload._links,user:{href:mode==='foreign-response' ? '/api/v3/users/8' : '/api/v3/users/7'}}});}
    throw Error('Unexpected request');
  };
  return {client:createLiveClient({baseUrl:'https://op.example',apiKey:'test-only',fetchImpl}),writes};
}
describe('OpenProject live writes',()=>{
  it('logs as current user without sending a readonly user field',async()=>{const {client,writes}=mock();const result=await client.create(entry);expect(result.id).toBe('501');expect(writes).toHaveLength(1);expect(writes[0]).toMatchObject({spentOn:entry.date,hours:'PT5400S',comment:{raw:'Review'},_links:{activity:{href:'/api/v3/time_entries/activities/3'}}});expect(writes[0]._links).not.toHaveProperty('user');});
  it('only supplies own user when the form requires explicit assignment and allows it',async()=>{const {client,writes}=mock('user-required');await client.create(entry);expect(writes[0]._links.user).toEqual({href:'/api/v3/users/7'});});
  it('rejects a form targeting another account before any create request',async()=>{const {client,writes}=mock('foreign-form');await expect(client.create(entry)).rejects.toThrow('different user');expect(writes).toHaveLength(0);});
  it('a created entry for another user is not reported as confirmed success',async()=>{const {client}=mock('foreign-response');await expect(client.create(entry)).rejects.toMatchObject({uncertain:true});});
  it.each(['denied','invalid'])('does not POST an entry when %s',async mode=>{const {client,writes}=mock(mode);await expect(client.create(entry)).rejects.toThrow();expect(writes).toHaveLength(0);});
  it('classifies a lost create response as uncertain without retrying',async()=>{const {client,writes}=mock('timeout');try{await client.create(entry);throw Error('Expected failure');}catch(error){expect(error).toBeInstanceOf(WriteError);expect((error as WriteError).uncertain).toBe(true);expect((error as Error).message).not.toContain('secret');}expect(writes).toHaveLength(1);});
  it('an explicit permission rejection is a known failure',async()=>{const {client}=mock('rejected');try{await client.create(entry);}catch(error){expect((error as WriteError).uncertain).toBe(false);}});
  it('rejects invalid input before any create request',async()=>{const {client,writes}=mock();await expect(client.create({...entry,hours:0})).rejects.toThrow();expect(writes).toHaveLength(0);});
});
