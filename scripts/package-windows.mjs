import { cp, mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Usage: node scripts/package-windows.mjs [--smoke]
//   default : hardened release (asar, Electron fuses, no test hooks) + zip, named from package.json version
//   --smoke : test build for Playwright (plain resources/app, smoke-hooks.cjs, no fuses, no zip). Never distribute.
const smoke = process.argv.includes('--smoke');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (process.platform !== 'win32' || process.arch !== 'x64') throw Error('This pilot package must be built on Windows x64.');
const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('package.json version must be MAJOR.MINOR.PATCH.');
const releaseRoot = path.join(root, 'release');
const output = path.join(releaseRoot, smoke ? 'smoke-win-x64' : `BigIn-Workspace-${version}-win-x64`);
if (path.dirname(output) !== releaseRoot) throw Error('Invalid output path.');
if (existsSync(output)) {
  if (!smoke) throw Error(`${path.basename(output)} already exists. Bump the version in package.json instead of overwriting a release.`);
  await rm(output, { recursive: true }); // smoke output is disposable and path-checked above
}
await mkdir(output, { recursive: true });
await cp(path.join(root, 'node_modules/electron/dist'), output, { recursive: true });
const exe = path.join(output, 'BigIn Workspace.exe');
await rename(path.join(output, 'electron.exe'), exe);

// Stage the app outside the output folder: Electron prefers resources/app over app.asar when both exist.
const stage = await mkdtemp(path.join(tmpdir(), 'bigin-stage-'));
try {
  await cp(path.join(root, 'dist/web'), path.join(stage, 'dist/web'), { recursive: true });
  await mkdir(path.join(stage, 'apps/desktop'), { recursive: true });
  const files = ['main.cjs', 'preload.cjs', 'op-service.cjs', 'live.cjs', ...(smoke ? ['smoke-hooks.cjs'] : [])];
  for (const file of files) await cp(path.join(root, 'apps/desktop', file), path.join(stage, 'apps/desktop', file));
  await writeFile(path.join(stage, 'package.json'), JSON.stringify({ name: 'bigin-workspace', productName: 'BigIn Workspace', version, main: 'apps/desktop/main.cjs' }, null, 2));
  if (smoke) {
    await cp(stage, path.join(output, 'resources/app'), { recursive: true });
  } else {
    const { createPackage } = await import('@electron/asar');
    await createPackage(stage, path.join(output, 'resources/app.asar'));
    const { flipFuses, FuseVersion, FuseV1Options } = await import('@electron/fuses');
    await flipFuses(exe, {
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    });
  }
} finally {
  await rm(stage, { recursive: true, force: true });
}
await writeFile(path.join(output, 'READ-ME.txt'), `BigIn Workspace Windows pilot ${version}\r\n\r\nExtract the entire ZIP, then open BigIn Workspace.exe. Keep the companion files beside the EXE.\r\nFirst launch asks for your OpenProject API token (op.bigin.vn).\r\nAdd time and Duplicate write real time entries. Task creation/status editing and reminders are not enabled in this pilot.\r\nThe token is encrypted for your Windows account; use Forget token to remove it.\r\nThis is an unsigned internal test build, not an installer.\r\n`);
if (smoke) {
  console.log(`Smoke build (do not distribute): ${output}`);
} else {
  const zip = output + '.zip';
  // Explicit absolute inputs stay under release; no shell interpolation.
  const zipScript = await readFile(path.join(root, 'scripts/zip-windows.ps1'), 'utf8');
  execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', zipScript], { stdio: 'inherit', env: { ...process.env, BIGIN_PACKAGE_ROOT: releaseRoot, BIGIN_PACKAGE_SOURCE: output, BIGIN_PACKAGE_ZIP: zip } });
  console.log(`Windows package: ${zip} (${Math.round((await stat(zip)).size / 1024 / 1024)} MB)`);
}
