const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const appUrl = pathToFileURL(path.join(__dirname, '../../dist/web/index.html')).href;
app.setName('BigIn Workspace');
let server = 'https://op.bigin.vn';
// Test-only overrides live in smoke-hooks.cjs, which release builds do not ship.
try { server = require('./smoke-hooks.cjs').apply(app, server); } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
let op;
function createWindow() {
  const window = new BrowserWindow({
    width: 1440, height: 960, minWidth: 720, minHeight: 600,
    show:false, backgroundColor: '#f7f8f4',
    autoHideMenuBar: true, title: 'BigIn Workspace',
    webPreferences: { preload:path.join(__dirname,'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => { if (url !== appUrl) event.preventDefault(); });
  window.webContents.on('will-attach-webview', event => event.preventDefault());
  window.once('ready-to-show',()=>{if(process.env.BIGIN_SMOKE!=='1')window.show();});
  window.loadURL(appUrl);
}
app.whenReady().then(async () => {
  op=require('./op-service.cjs').createService(app.getPath('userData'),server);
  let startupError=''; try {await op.start();} catch(error) {startupError=error.message;}
  for(const name of ['status','connect','disconnect','load','search','write','resolve']) ipcMain.handle('op:'+name,async(event,...args)=>{
    if(event.senderFrame!==event.sender.mainFrame || event.senderFrame?.url.split('#')[0]!==appUrl) return {ok:false,error:'Untrusted request.',kind:'security'};
    try {if(startupError)throw Error(startupError); return {ok:true,value:await op[name](...args)};} catch(error){return {ok:false,error:error.kind ? error.message : (['status','load','search'].includes(name) ? 'Could not load OpenProject data. Check your connection or reconnect.' : error.message || 'OpenProject operation failed.'),kind:error.kind ?? 'operation'};}
  });
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
// Background reminders intentionally not enabled until real data/auth and policy are ready.
app.on('window-all-closed', () => app.quit());
