import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-12T09:00:00+07:00'));
  await page.goto('/');
});
test('daily deficit is not hidden by excess hours elsewhere', async ({ page }) => {
  await page.getByRole('tab', { name: 'Week', exact: true }).click();
  await page.getByRole('button', { name: 'Previous period' }).click();
  const cards = page.getByTestId('metric');
  await expect(cards.nth(0).locator('[data-slot=card-content] p')).toHaveText('40 hours');
  await expect(cards.nth(2).locator('[data-slot=card-content] p')).toHaveText('2 hours');
});
test('duplicate is blank, warns without blocking, removes a draft, preserves original and persists', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions sample-1', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  for (const date of ['2026-10-12', '2026-10-13', '2026-10-14']) await page.getByRole('button', { name: `Select date ${date}`, exact: true }).click();
  await page.getByTestId('duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('spinbutton', { name: 'Hours 2026-10-12' })).toHaveValue('');
  await expect(dialog.getByTestId('duplicate-row-2026-10-12')).toHaveAttribute('data-warning', 'true');
  await expect(dialog.getByTestId('duplicate-row-2026-10-12')).toContainText('Duplicate will add another');
  await dialog.getByRole('button', { name: 'Duplicate (3)', exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('entry-row')).toHaveCount(2);
  await dialog.getByRole('spinbutton', { name: 'Hours 2026-10-12' }).fill('1.5');
  await dialog.getByRole('spinbutton', { name: 'Hours 2026-10-13' }).fill('2');
  await dialog.getByRole('button', { name: 'Remove 2026-10-14' }).click();
  await expect(dialog.getByRole('spinbutton')).toHaveCount(2);
  await dialog.getByRole('button', { name: 'Duplicate (2)', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('entry-row')).toHaveCount(3);
  await expect(page.getByTestId('entry-row').first().getByText('4h', { exact: true })).toHaveText('4h');
  await page.reload();
  await expect(page.getByTestId('entry-row')).toHaveCount(3);
  await page.getByRole('button', { name: 'View date 2026-10-13' }).click();
  await expect(page.getByTestId('entry-row')).toHaveCount(1);
  await expect(page.getByTestId('entry-row')).toContainText('2h');
});
test('cancel duplicate does not write and Remove all prevents submission', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions sample-1', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.getByTestId('duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await page.getByRole('button', { name: 'Remove 2026-10-13' }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Duplicate', exact: true })).toBeDisabled();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByTestId('entry-row')).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem('bigin-demo-v1'))).toBeNull();
});
test('drawer finds a task, saves locally and can create a task without copying an ID', async ({ page }) => {
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Search tasks' }).fill('Requirement');
  await dialog.getByTestId('task-option').click();
  await dialog.getByRole('spinbutton').fill('2');
  await dialog.getByRole('button', { name: 'Save time' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('entry-row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  await dialog.getByRole('button', { name: 'Create a new sample task' }).click();
  await dialog.getByRole('textbox', { name: 'Task title' }).fill('Pilot workflow review');
  await dialog.getByRole('button', { name: 'Continue', exact: false }).click();
  await dialog.getByRole('spinbutton').fill('1');
  await dialog.getByRole('button', { name: 'Save time' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('entry-row').last()).toContainText('Pilot workflow review');
});
test('OS reduced motion is respected and narrow screen remains usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('workspace')).toHaveAttribute('data-reduced', 'true');
  await page.getByRole('button', { name: 'Motion', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Current: reduced motion');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('preview renders without page errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: 'test-results/workspace-preview.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('returning to date selection keeps entered hours; removing and reselecting resets only that date', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions sample-1', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-14' }).click();
  await page.getByTestId('duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await page.getByRole('spinbutton', { name: 'Hours 2026-10-13' }).fill('3');
  await page.getByRole('button', { name: 'Choose dates again' }).click();
  await page.getByTestId('duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Hours 2026-10-13' })).toHaveValue('3');
  await page.getByRole('button', { name: 'Remove 2026-10-13' }).click();
  await page.getByRole('button', { name: 'Choose dates again' }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.getByTestId('duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Hours 2026-10-13' })).toHaveValue('');
  await page.screenshot({ path: 'test-results/duplicate-preview.png' });
});

test('storage failure keeps draft and does not claim success', async ({ page }) => {
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  await page.getByRole('dialog').getByTestId('task-option').first().click();
  await page.getByRole('spinbutton').fill('2.5');
  await page.getByRole('button', { name: 'Save time' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('spinbutton')).toHaveValue('2.5');
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Couldn’t save');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByTestId('entry-row')).toHaveCount(2);
});

test('workspace inherits Theme Lab tokens, syncs across tabs and uses native components', async ({ page, context }) => {
  const lab = await context.newPage(); await lab.goto('/design-system');
  await lab.getByRole('button', { name:'BDS Blue', exact:true }).click();
  await lab.getByRole('button', { name:'Light', exact:true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.getByRole('button',{name:'Add time',exact:true})).toHaveCSS('background-color','rgb(30, 85, 235)');
  await page.getByRole('button',{name:'Add time',exact:true}).click();
  const drawer = page.getByRole('dialog',{name:'Add time'});
  await expect(drawer).toHaveAttribute('data-slot','drawer-dialog');
  await expect(drawer.getByRole('textbox',{name:'Search tasks'})).toHaveCSS('background-color','rgb(223, 224, 226)');
  await drawer.getByRole('button',{name:'Project'}).click();
  await page.getByRole('option',{name:'MiVida',exact:true}).click();
  await expect(drawer.getByTestId('task-option')).toHaveCount(2);
  await expect(drawer.getByTestId('task-option').first()).toContainText('MiVida');
  await drawer.getByRole('button',{name:'Close drawer',exact:true}).click(); await expect(drawer).toHaveCount(0);
  await page.getByRole('button',{name:'Actions sample-1',exact:true}).click();
  await page.getByRole('menuitem',{name:'Duplicate',exact:true}).click();
  await page.getByRole('button',{name:'Select date 2026-10-12',exact:true}).click();
  await page.getByTestId('duplicate-banner').getByRole('button',{name:'Duplicate'}).click();
  const row = page.getByTestId('duplicate-row-2026-10-12');
  const expected = await row.evaluate(el => { const probe = document.createElement('span'); probe.style.color='var(--warning-soft)'; el.append(probe); const color=getComputedStyle(probe).color; probe.remove(); return color; });
  await expect(row).toHaveCSS('background-color',expected);
  await expect(page.getByRole('dialog',{name:'One day, one stretch of time.'})).toHaveAttribute('data-slot','modal-dialog');
  await expect(page.getByRole('dialog',{name:'One day, one stretch of time.'})).toHaveCSS('opacity','1');
  await expect(page.locator('[data-slot="modal-backdrop"]')).toHaveCSS('opacity','1');
  await expect(page.locator('[data-slot="modal-container"]')).toHaveCSS('opacity','1');
  await page.screenshot({path:'test-results/workspace-system-warning.png'});
  await lab.close();
});

test('dirty drawer dismissal keeps input until the user explicitly discards', async ({page}) => {
  await page.getByRole('button',{name:'Add time',exact:true}).click();
  await page.getByRole('dialog').getByTestId('task-option').first().click();
  await page.getByRole('spinbutton').fill('3.5'); await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('spinbutton')).toHaveValue('3.5');
  await page.getByRole('button',{name:'Keep editing',exact:true}).click();
  await page.getByRole('button',{name:'Close drawer',exact:true}).click();
  await page.getByRole('button',{name:'Discard draft',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('bigin-demo-v1'))).toBeNull();
});

test('system compositions retain stock appearance on desktop and fit a narrow viewport', async ({page}) => {
  await expect(page.getByRole('button',{name:'Add time',exact:true})).toHaveClass(/button--primary/);
  await expect(page.getByRole('button',{name:'View date 2026-10-12',exact:true})).toHaveClass(/toggle-button/);
  await page.screenshot({path:'test-results/workspace-system-dashboard.png',fullPage:true});
  await page.getByRole('button',{name:'Add time',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Add time'})).toHaveCSS('opacity','1');
  await page.screenshot({path:'test-results/workspace-system-drawer.png'});
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/workspace-system-mobile.png',fullPage:true});
});
