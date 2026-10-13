import { test, expect } from '@playwright/test';

test.beforeEach(async ({page})=> { await page.goto('/design-system'); await expect(page.getByTestId('theme-preview')).toBeVisible(); });
test('isolated HeroUI preview uses actual native component styles and persists theme changes', async ({page})=> {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.getByRole('button',{name:'Add time',exact:true})).toHaveClass(/button--primary/);
  const legacy=await page.evaluate(()=> Array.from(document.styleSheets).some(s=>{try{return Array.from(s.cssRules).some(rule=>rule.cssText.includes('.metric-attention')||rule.cssText.includes('.nav-item.button'));}catch{return false;}}));
  expect(legacy).toBe(false);
  await page.getByRole('button',{name:'BDS Blue',exact:true}).click();
  await page.getByRole('button',{name:'Light',exact:true}).click();
  const field=page.getByRole('textbox',{name:'Your email',exact:false});
  await expect(field).toHaveCSS('background-color','rgb(223, 224, 226)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.getByRole('textbox',{name:'Your email',exact:false})).toHaveCSS('background-color','rgb(223, 224, 226)');
  expect(errors).toEqual([]);
});
test('radius/density update a valid concentric sample; stripes use I1', async ({page})=> {
  await page.getByRole('button',{name:'BDS Blue',exact:true}).click();
  await page.getByRole('button',{name:'Light',exact:true}).click();
  await page.getByRole('tab',{name:'Foundations',exact:true}).click();
  await page.getByRole('button',{name:'Rounded',exact:true}).click();
  const outer=page.getByTestId('nested-outer'),inner=page.getByTestId('nested-inner');
  await expect(outer).toHaveCSS('border-top-left-radius','20px');await expect(inner).toHaveCSS('border-top-left-radius','12px');
  await page.getByRole('button',{name:'Compact',exact:true}).click();
  await expect(outer).toHaveCSS('border-top-left-radius','16px');
  await page.getByRole('tab',{name:'Dashboard',exact:true}).click();
  const rows=page.getByRole('row');
  await expect(rows.nth(2).getByRole('rowheader')).toHaveCSS('background-color','rgb(244, 245, 245)');
});
test('real HeroUI modal, drawer and tooltip work and inherit the selected theme', async ({page})=> {
  await page.getByRole('button',{name:'Open modal',exact:true}).click();
  const modal=page.getByRole('dialog',{name:'Review your week'});
  await expect(modal).toBeVisible();
  await expect(modal).toHaveCSS('opacity','1');
  await expect(modal).toHaveCSS('box-shadow',/rgba\(0, 0, 0, 0\.12\) 2px 4px 16px 0px$/);
  await modal.getByRole('button',{name:'Why 2 hours?',exact:true}).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.getByRole('tooltip')).toHaveCSS('opacity','1');
  const tooltipZ=await page.getByRole('tooltip').evaluate(el=>Number(getComputedStyle(el).zIndex));
  const modalZ=await page.locator('[data-slot="modal-backdrop"]').evaluate(el=>Number(getComputedStyle(el).zIndex));
  expect(tooltipZ).toBeGreaterThanOrEqual(modalZ);
  const followsModal=await page.getByRole('tooltip').evaluate(el=>{
    const backdrop=document.querySelector('[data-slot="modal-backdrop"]')!;
    return Boolean(backdrop.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(followsModal).toBe(true);
  await page.screenshot({path:'test-results/theme-tooltip-modal.png'});
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);
  await page.getByRole('button',{name:'Open drawer',exact:true}).click();
  const drawer=page.getByRole('dialog',{name:'Add time'});await expect(drawer).toBeVisible();
  await drawer.getByRole('button',{name:'Cancel',exact:true}).click();await expect(drawer).toHaveCount(0);
});
test('export reflects current tokens and JSON/CSS download is usable', async ({page})=> {
  await page.getByRole('button',{name:'BDS Blue',exact:true}).click();await page.getByRole('button',{name:'Light',exact:true}).click();
  await page.getByRole('button',{name:'Export',exact:true}).click();
  const text=page.getByRole('textbox',{name:'Exported theme'});const json=JSON.parse(await text.inputValue());
  expect(json.schema).toBe('bigin.design-tokens/v1');expect(json.settings.preset).toBe('bds');expect(json.tokens['color.table.row.alternate'].value).toBe('#f4f5f5');
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download JSON'}).click();expect((await downloadPromise).suggestedFilename()).toBe('bigin-theme.json');
  await page.getByRole('button',{name:'CSS',exact:true}).click();await expect(text).toHaveValue(/--ds-table-stripe: #f4f5f5/);
});
test('typography and custom accent controls change tokens; registry shows a passing audit', async ({page})=> {
  await page.getByRole('slider',{name:'Font scale',exact:true}).press('End');
  await expect(page.locator('html')).toHaveCSS('font-size','18.4px');
  await page.getByRole('slider',{name:'Hue',exact:true}).press('ArrowRight');
  await expect(page.locator('html')).toHaveCSS('--accent','oklch(0.58 0 1)');
  await page.getByRole('tab',{name:'Tokens',exact:true}).click();
  await expect(page.getByText('Audit PASS', {exact:true})).toBeVisible();
  await page.getByRole('textbox',{name:'Search tokens'}).fill('field.placeholder');
  await expect(page.locator('.preview-token-table').first()).toContainText('--field-placeholder');
});
test('reduced motion respects OS and interactive preview has screenshots on desktop and mobile', async ({page})=> {
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveAttribute('data-reduce-motion','true');
  await page.screenshot({path:'test-results/theme-neutral-dark.png',fullPage:true});
  await page.getByRole('button',{name:'Light',exact:true}).click();await page.screenshot({path:'test-results/theme-neutral-light.png',fullPage:true});
  await page.getByRole('button',{name:'BDS Blue',exact:true}).click();await page.screenshot({path:'test-results/theme-bds-light.png',fullPage:true});
  await page.getByRole('tab',{name:'Dashboard',exact:true}).click();await page.screenshot({path:'test-results/theme-dashboard.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/theme-mobile.png',fullPage:true});
});
