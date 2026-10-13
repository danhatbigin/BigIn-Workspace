import { describe, it, expect } from 'vitest';
import { defaultSettings, resolveTheme, exportTokens, exportCss, isSettings, contrastRatio } from './theme';
describe('token model and HeroUI bridge', () => {
  it('neutral uses observed reference values in both modes', () => {
    expect(resolveTheme(defaultSettings).values['--accent']).toBe('oklch(98.48% 0 0)');
    expect(resolveTheme({...defaultSettings,mode:'light'}).values['--accent']).toBe('oklch(0 0 0)');
  });
  it('preserves owner color roles: I1 stripe, I2 field, I3 border, I9 body', () => {
    const t=resolveTheme({...defaultSettings,preset:'bds',mode:'light'});
    expect(t.values['--background']).toBe('#f4f5f5');
    expect(t.values['--ds-table-stripe']).toBe(t.values['--background']);
    expect(t.values['--field-background']).toBe('#dfe0e2');
    expect(t.values['--border']).toBe('#babbbf');
    expect(t.values['--foreground']).toBe('#222325');
  });
  it('contrast-safe placeholder is explicit and never edits source palette', () => {
    const original=resolveTheme({...defaultSettings,preset:'bds',mode:'light',contrastSafe:false});
    const safe=resolveTheme({...defaultSettings,preset:'bds',mode:'light',contrastSafe:true});
    expect(original.values['--field-placeholder']).toBe('#6c6e75');
    expect(safe.placeholderAdjusted).toBe(true);
    expect(contrastRatio(safe.values['--field-placeholder'],safe.values['--field-background'])).toBeGreaterThanOrEqual(4.5);
    expect(safe.tokens.find(t=>t.name==='color.palette.interface.i6')?.value).toBe('#6c6e75');
  });
  it('nested radius derives from actual inset for every profile/density', () => {
    for(const radius of ['sharp','rounded','circular'] as const)for(const density of ['compact','comfortable'] as const){
      const t=resolveTheme({...defaultSettings,radius,density});
      expect(Number(t.values['--ds-radius-outer'])).toBe(Number(t.values['--ds-radius-inner'])+Number(t.values['--ds-nested-inset']));
    }
  });
  it('exports resolvable aliases, identical CSS bridge, and declared draft schema', () => {
    for(const preset of ['neutral','bds','custom'] as const){
      const t=resolveTheme({...defaultSettings,preset}); const exported=exportTokens({...defaultSettings,preset});
      expect(new Set(t.tokens.map(t=>t.name)).size).toBe(t.tokens.length);
      for(const token of t.tokens)if(token.alias)expect(exported.tokens[token.alias],token.name).toBeDefined();
      for(const [key,value]of Object.entries(t.values))expect(exportCss({...defaultSettings,preset})).toContain(`${key}: ${value};`);
      expect(exported.schema).toBe('bigin.design-tokens/v1');
    }
  });
  it('rejects invalid persisted settings instead of injecting arbitrary CSS', () => {
    expect(isSettings(defaultSettings)).toBe(true);
    expect(isSettings({...defaultSettings,chroma:Infinity})).toBe(false);
    expect(isSettings({...defaultSettings,preset:'url(malicious)'})).toBe(false);
    expect(isSettings({...defaultSettings,fontScale:-2})).toBe(false);
  });
});
