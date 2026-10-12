import { _electron as electron } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const profile = await mkdtemp(path.join(tmpdir(), 'bigin-electron-smoke-'));
let app;
try {
  app = await electron.launch({ args: ['.', `--user-data-dir=${profile}`], env: { ...process.env, BIGIN_SMOKE: '1' } });
  const page = await app.firstWindow();
  await page.getByRole('heading', { level: 1 }).waitFor();
  const security = await app.evaluate(({ BrowserWindow }) => {
    const prefs = BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();
    return { sandbox: prefs.sandbox, nodeIntegration: prefs.nodeIntegration, contextIsolation: prefs.contextIsolation };
  });
  if (!security.sandbox || security.nodeIntegration || !security.contextIsolation) throw new Error('Unsafe Electron settings');
  if (await page.evaluate(() => typeof window.require !== 'undefined')) throw new Error('Node exposed to renderer');
  await page.getByRole('button', { name: 'Thêm thời gian', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  console.log('PASS: Electron production renderer, drawer and security defaults on ' + process.platform);
} finally {
  if (app) await app.close();
  // This is a newly-created test-owned temp profile, never a user profile.
  const resolved = path.resolve(profile);
  if (path.dirname(resolved) !== path.resolve(tmpdir()) || !path.basename(resolved).startsWith('bigin-electron-smoke-')) throw new Error('Unsafe cleanup target');
  await rm(resolved, { recursive: true, force: true, maxRetries: 3 });
}
