const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const appUrl = pathToFileURL(path.join(__dirname, '../../dist/web/index.html')).href;
app.setName('BigIn Workspace');
function createWindow() {
  const window = new BrowserWindow({
    width: 1440, height: 960, minWidth: 720, minHeight: 600,
    show: process.env.BIGIN_SMOKE !== '1', backgroundColor: '#f7f8f4',
    autoHideMenuBar: true, title: 'BigIn Workspace · Local preview',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => { if (url !== appUrl) event.preventDefault(); });
  window.webContents.on('will-attach-webview', event => event.preventDefault());
  window.loadURL(appUrl);
}
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
// Background reminders intentionally not enabled until real data/auth and policy are ready.
app.on('window-all-closed', () => app.quit());
