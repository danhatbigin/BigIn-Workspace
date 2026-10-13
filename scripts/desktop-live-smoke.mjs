import { _electron as electron, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const profile=await mkdtemp(path.join(tmpdir(),'bigin-live-test-'));
const token='test-only-mock-token'; const today='2026-10-12'; let allow13=false; let creates=[];
const wp={id:42,subject:'Requirement review',_links:{project:{href:'/api/v3/projects/5',title:'Bigin'},status:{title:'In progress'},logTime:{href:'/api/v3/time_entries/form'}}};
const existing={id:100,spentOn:today,hours:'PT6H',comment:{raw:'Existing entry'},_links:{user:{href:'/api/v3/users/7'},project:wp._links.project,workPackage:{href:'/api/v3/work_packages/42'},activity:{href:'/api/v3/time_entries/activities/3'}}};
const entries=[existing];
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost'); const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const body=chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : undefined;
  const send=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/hal+json'});res.end(JSON.stringify(data));};
  if(req.headers.authorization!=='Basic '+Buffer.from('apikey:'+token).toString('base64'))return send({},401);
  if(url.pathname==='/api/v3/users/me')return send({id:7,name:'Pilot User'});
  if(url.pathname==='/api/v3/work_packages/42')return send(wp);
  if(url.pathname==='/api/v3/work_packages')return send({total:1,_embedded:{elements:[wp]}});
  if(url.pathname==='/api/v3/time_entries/form')return send({_embedded:{payload:{...body,_links:{...body._links,activity:{href:'/api/v3/time_entries/activities/3'},user:{href:'/api/v3/users/7'}}},schema:{activity:{},user:{writable:false}},validationErrors:body._links.user ? {user:{errorIdentifier:'Readonly'}} : {}}});
  if(url.pathname==='/api/v3/time_entries' && req.method==='GET'){
    const filters=JSON.parse(url.searchParams.get('filters'));if(filters[0].user.values[0]!=='me')return send({},500);
    const [from,to]=filters[1].spentOn.values;const visible=entries.filter(entry=>entry.spentOn>=from && entry.spentOn<=to);
    // Deliberately include a foreign user; client must exclude it even with server filtering.
    return send({total:visible.length+1,_embedded:{elements:[...visible,{...existing,id:999,hours:'PT100H',_links:{...existing._links,user:{href:'/api/v3/users/8'}}}]}});
  }
  if(url.pathname==='/api/v3/time_entries' && req.method==='POST'){
    if(body._links.user)return send({},422);
    creates.push(body);if(body.spentOn==='2026-10-13' && !allow13)return send({},403);
    const saved={...body,id:100+entries.length,_links:{...body._links,user:{href:'/api/v3/users/7'}}};entries.push(saved);
    if(body.spentOn==='2026-10-14'){res.destroy();return;}
    return send(saved,201);
  }
  send({},404);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const baseUrl=`http://127.0.0.1:${server.address().port}`;
let app;
const launch=()=>electron.launch({...(process.env.BIGIN_PACKAGED_EXE ? {executablePath:process.env.BIGIN_PACKAGED_EXE}:{}),args:process.env.BIGIN_PACKAGED_EXE ? [`--user-data-dir=${profile}`] : ['.',`--user-data-dir=${profile}`],env:{...process.env,BIGIN_SMOKE:'1',BIGIN_TEST_PROFILE:profile,BIGIN_TEST_OP_URL:baseUrl}});
try {
  app=await launch();let page=await app.firstWindow();
  await expect(page.getByLabel('API token')).toBeVisible();
  await mkdir('test-results',{recursive:true});
  const onboarding=await page.locator('[data-slot="card"]').boundingBox();
  await page.screenshot({path:'test-results/windows-first-run.png',clip:{x:onboarding.x-24,y:onboarding.y-24,width:onboarding.width+48,height:onboarding.height+48}});
  await page.getByLabel('API token').fill('invalid-token');
  await page.getByRole('button',{name:'Connect and load my time'}).click();
  await expect(page.getByRole('alert')).toContainText('401');
  await page.getByLabel('API token').fill(token);
  await page.getByRole('button',{name:'Connect and load my time'}).click();
  await expect(page.getByText('Connected as Pilot User')).toBeVisible();
  await page.getByRole('button',{name:'Toggle color mode'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('html')).toHaveAttribute('data-reduce-motion','true');
  await page.getByRole('button',{name:`View date ${today}`,exact:true}).click();
  await expect(page.getByTestId('entry-row')).toHaveCount(1);
  expect(await page.evaluate(()=>localStorage.getItem('bigin-demo-v1'))).toBeNull();
  expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain(token);
  expect((await readFile(path.join(profile,'op-credentials.bin'))).includes(Buffer.from(token))).toBe(false);
  const security=await app.evaluate(({BrowserWindow})=>{const prefs=BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();return {sandbox:prefs.sandbox,contextIsolation:prefs.contextIsolation,nodeIntegration:prefs.nodeIntegration};});
  expect(security).toEqual({sandbox:true,contextIsolation:true,nodeIntegration:false});
  expect(await page.evaluate(()=>typeof window.require)).toBe('undefined');
  await page.getByRole('button',{name:'Add time',exact:true}).click();
  await page.getByRole('textbox',{name:'Search tasks'}).fill('42');
  await page.getByTestId('task-option').click();
  await page.getByRole('spinbutton').fill('2');
  await page.getByRole('textbox',{name:'Note',exact:false}).fill('Pilot log');
  await page.getByRole('button',{name:'Save time'}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.getByTestId('entry-row')).toHaveCount(2);
  await page.getByRole('button',{name:'Actions 100',exact:true}).click();await page.getByRole('menuitem',{name:'Duplicate',exact:true}).click();
  for(const date of [today,'2026-10-13','2026-10-14'])await page.getByRole('button',{name:`Select date ${date}`,exact:true}).click();
  await page.getByTestId('duplicate-banner').getByRole('button',{name:'Duplicate'}).click();
  for(const date of [today,'2026-10-13','2026-10-14'])await page.getByRole('spinbutton',{name:`Hours ${date}`}).fill('1');
  await page.getByRole('button',{name:'Duplicate (3)',exact:true}).click();
  await expect(page.getByRole('spinbutton',{name:`Hours ${today}`})).toHaveCount(0);
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('unknown');
  await expect(page.getByRole('spinbutton',{name:'Hours 2026-10-14'})).toBeDisabled();
  expect(creates.filter(entry=>entry.spentOn==='2026-10-14')).toHaveLength(1);
  allow13=true;await page.getByRole('button',{name:'Duplicate (2)',exact:true}).click();
  await expect(page.getByRole('spinbutton',{name:'Hours 2026-10-13'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Duplicate (1)',exact:true})).toBeDisabled();
  expect(creates.filter(entry=>entry.spentOn===today)).toHaveLength(2); // Add + one duplicate, no repeat of saved day.
  await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('button',{name:'Refresh',exact:true}).click();
  await expect(page.getByRole('button',{name:'Refresh',exact:true})).toBeEnabled();
  await page.getByRole('button',{name:'View date 2026-10-14',exact:true}).click();await expect(page.getByTestId('entry-row')).toHaveCount(1);
  // First-run pixels are captured above; verify the hidden live window through DOM/API state.
  await app.close();app=await launch();page=await app.firstWindow();
  await expect(page.getByText('Connected as Pilot User')).toBeVisible();
  await expect(page.getByLabel('API token')).toHaveCount(0);
  const blocked=await page.evaluate(async()=>window.biginDesktop.write([{id:'new-attempt',taskId:'42',date:'2026-10-14',hours:1,note:'Existing entry',activityId:3}]));
  expect(blocked.value.outcomes[0].status).toBe('uncertain');expect(creates.filter(entry=>entry.spentOn==='2026-10-14')).toHaveLength(1);
  // Editing hours/note must not bypass the guard for the same task and day.
  const edited=await page.evaluate(async()=>window.biginDesktop.write([{id:'edited-attempt',taskId:'42',date:'2026-10-14',hours:3,note:'Edited note',activityId:3}]));
  expect(edited.value.outcomes[0].status).toBe('uncertain');expect(creates.filter(entry=>entry.spentOn==='2026-10-14')).toHaveLength(1);
  // After the owner confirms in OpenProject, resolve lifts only that block; retry reaches the server again.
  const journal=JSON.parse(await readFile(path.join(profile,'op-write-journal.json'),'utf8'));const stuck=journal.find(item=>item.status==='uncertain');
  expect(stuck?.slot).toBeTruthy();
  const none=await page.evaluate(async()=>window.biginDesktop.resolve(['not-a-journal-id']));expect(none.value.resolved).toBe(0);
  const lifted=await page.evaluate(async id=>window.biginDesktop.resolve([id]),stuck.clientId);expect(lifted.value.resolved).toBe(1);
  await page.evaluate(async()=>window.biginDesktop.write([{id:'after-check',taskId:'42',date:'2026-10-14',hours:3,note:'Edited note',activityId:3}]));
  expect(creates.filter(entry=>entry.spentOn==='2026-10-14')).toHaveLength(2);
  await page.getByRole('button',{name:'Forget token',exact:true}).click();await expect(page.getByLabel('API token')).toBeVisible();
  await expect(readFile(path.join(profile,'op-credentials.bin'))).rejects.toThrow();
  console.log('PASS: Windows first run, encrypted token/restart/forget, current-user reads, real POST contract against mock, duplicate partial/uncertain retry protection and renderer isolation.');
}catch(error){if(app){await mkdir('test-results',{recursive:true});try{await (await app.firstWindow()).screenshot({path:'test-results/desktop-live-error.png'});}catch{}}throw error;}finally{
  if(app)await app.close(); server.closeAllConnections(); await new Promise(resolve=>server.close(resolve));
  if(path.dirname(path.resolve(profile))!==path.resolve(tmpdir()) || !path.basename(profile).startsWith('bigin-live-test-'))throw Error('Unsafe test cleanup target');
  await rm(profile,{recursive:true,force:true,maxRetries:3});
}
