import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-12T09:00:00+07:00'));
  await page.goto('/');
});
test('daily deficit is not hidden by excess hours elsewhere', async ({ page }) => {
  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await page.getByRole('button', { name: 'Previous period' }).click();
  const cards = page.locator('.metric');
  await expect(cards.nth(0).locator('.metric-value')).toHaveText('40hours');
  await expect(cards.nth(2).locator('.metric-value')).toHaveText('2hours');
});
test('duplicate is blank, warns without blocking, removes a draft, preserves original and persists', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions sample-1', exact: true }).click();
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  for (const date of ['2026-10-12', '2026-10-13', '2026-10-14']) await page.getByRole('button', { name: `Select date ${date}`, exact: true }).click();
  await page.locator('.duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('spinbutton', { name: 'Hours 2026-10-12' })).toHaveValue('');
  await expect(dialog.getByTestId('duplicate-row-2026-10-12')).toHaveClass(/has-warning/);
  await expect(dialog.getByTestId('duplicate-row-2026-10-12')).toContainText('Duplicate will add another');
  await dialog.getByRole('button', { name: 'Duplicate (3)', exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(page.locator('.entry-row')).toHaveCount(2);
  await dialog.getByRole('spinbutton', { name: 'Hours 2026-10-12' }).fill('1.5');
  await dialog.getByRole('spinbutton', { name: 'Hours 2026-10-13' }).fill('2');
  await dialog.getByRole('button', { name: 'Remove 2026-10-14' }).click();
  await expect(dialog.getByRole('spinbutton')).toHaveCount(2);
  await dialog.getByRole('button', { name: 'Duplicate (2)', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.entry-row')).toHaveCount(3);
  await expect(page.locator('.entry-row').first().locator('.entry-hours')).toHaveText('4 h');
  await page.reload();
  await expect(page.locator('.entry-row')).toHaveCount(3);
  await page.getByRole('button', { name: 'View date 2026-10-13' }).click();
  await expect(page.locator('.entry-row')).toHaveCount(1);
  await expect(page.locator('.entry-hours')).toHaveText('2 h');
});
test('cancel duplicate does not write and Remove all prevents submission', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions sample-1', exact: true }).click();
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.locator('.duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await page.getByRole('button', { name: 'Remove 2026-10-13' }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Duplicate', exact: true })).toBeDisabled();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.entry-row')).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem('bigin-demo-v1'))).toBeNull();
});
test('drawer finds a task, saves locally and can create a task without copying an ID', async ({ page }) => {
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Search tasks' }).fill('Requirement');
  await dialog.locator('.task-option').click();
  await dialog.getByRole('spinbutton').fill('2');
  await dialog.getByRole('button', { name: 'Save time' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.entry-row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  await dialog.getByRole('button', { name: 'Create a new sample task' }).click();
  await dialog.getByRole('textbox', { name: 'Task title' }).fill('Pilot workflow review');
  await dialog.getByRole('button', { name: 'Continue', exact: false }).click();
  await dialog.getByRole('spinbutton').fill('1');
  await dialog.getByRole('button', { name: 'Save time' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.entry-row').last()).toContainText('Pilot workflow review');
});
test('OS reduced motion is respected and narrow screen remains usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.app')).toHaveAttribute('data-reduced', 'true');
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
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-14' }).click();
  await page.locator('.duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await page.getByRole('spinbutton', { name: 'Hours 2026-10-13' }).fill('3');
  await page.getByRole('button', { name: 'Choose dates again' }).click();
  await page.locator('.duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Hours 2026-10-13' })).toHaveValue('3');
  await page.getByRole('button', { name: 'Remove 2026-10-13' }).click();
  await page.getByRole('button', { name: 'Choose dates again' }).click();
  await page.getByRole('button', { name: 'Select date 2026-10-13' }).click();
  await page.locator('.duplicate-banner').getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Hours 2026-10-13' })).toHaveValue('');
  await page.screenshot({ path: 'test-results/duplicate-preview.png' });
});

test('storage failure keeps draft and does not claim success', async ({ page }) => {
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Add time', exact: true }).click();
  await page.getByRole('dialog').locator('.task-option').first().click();
  await page.getByRole('spinbutton').fill('2.5');
  await page.getByRole('button', { name: 'Save time' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('spinbutton')).toHaveValue('2.5');
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Couldn’t save');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.entry-row')).toHaveCount(2);
});
