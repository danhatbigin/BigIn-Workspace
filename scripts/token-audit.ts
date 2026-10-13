import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
const base = 'apps/web/src/preview/';
const cssFiles = ['preview/layout.css','system/system.css','system/adapters.css'];
const errors: string[] = [];
let selectorCount = 0, buttonSkinSelectors = 0, rawColors = 0;
const adapterProperties = new Set(['--surface-secondary','--surface-foreground','--overlay-shadow','--drawer-enter-duration','--drawer-exit-duration','--drawer-enter-ease','--drawer-exit-ease','border-bottom-width','background-color','transition-duration','animation-duration','transition-timing-function','animation-timing-function']);
for (const file of cssFiles) {
  const content = readFileSync('apps/web/src/'+file,'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  const colors = content.match(/#[\da-f]{3,8}\b|(?:rgb|rgba|oklch|hsl)\([^)]*\)/gi) ?? [];
  rawColors += colors.length;
  if (colors.length) errors.push(`${file}: literal colors belong in token source.`);
  for (const match of content.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (match[1].trim().startsWith('@')) continue;
    const selector=match[1].trim(); selectorCount++;
    if (/\.button\b|\.input\b|\.card(?:__|--|\b)/.test(selector)) { buttonSkinSelectors++; errors.push(`${file}: component skin selector ${selector}`); }
    if (file.endsWith('/adapters.css')) for (const declaration of match[2].split(';')) {
      const property = declaration.trim().split(':')[0];
      if (property && !adapterProperties.has(property)) errors.push(`Adapter property not disclosed: ${property}`);
    }
  }
}
const appFiles = readdirSync('apps/web/src', { recursive:true, withFileTypes:true }).filter(entry => entry.isFile() && /\.(tsx?|css)$/.test(entry.name)).map(entry => entry.parentPath+'/'+entry.name);
for (const file of appFiles) {
  const content = readFileSync(file,'utf8');
  if (file.endsWith('.css') && !['preview/preview.css',...cssFiles].some(allowed => file.replaceAll('\\','/').endsWith('/'+allowed))) errors.push(`${file}: new CSS file must be disclosed in the system audit.`);
  if (file.endsWith('.tsx')) {
    if (/#[\da-f]{3,8}\b|(?:rgb|rgba|oklch|hsl)\(/i.test(content)) errors.push(`${file}: JSX contains literal colors.`);
    if (/<Button\b[^>]*\b(?:className|style|render)\s*=/.test(content)) errors.push(`${file}: Button presentation override.`);
    if (/<(?:select|dialog)\b/.test(content)) errors.push(`${file}: use the system Select/Modal/Drawer.`);
    if (/\b(?:bg|text|border|ring|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d|\b)/.test(content)) errors.push(`${file}: palette utilities bypass semantic system tokens.`);
    // Calendar changes layout only; interactive appearance stays stock ToggleButton.
    for (const match of content.matchAll(/<ToggleButton\b[^>]*className="([^"]*)"/g)) {
      if (match[1] !== 'h-auto min-h-28 w-full flex-col items-stretch justify-start gap-2 p-3') errors.push(`${file}: ToggleButton override is outside the disclosed layout composition.`);
    }
  }
  if (/(?:^|\n)\s*(?:import|@import)\s+[^;\n]*(?:polish\.css|(?:\.\/|\.\.\/)styles\.css|(?:\.\/|\.\.\/)tokens\.css)/.test(content)) errors.push(`${file}: legacy CSS import.`);
}
for (const file of ['polish.css','tokens.css','styles.css','Dialog.tsx','preview/adapters.css']) if (existsSync('apps/web/src/'+file)) errors.push(`Obsolete file still present: ${file}`);
const result = { scope: 'workspace and design preview; shared theme/runtime and application CSS/JSX', status: errors.length?'FAIL':'PASS', buttonSkinSelectors, rawColors, customCssFiles: cssFiles, selectorCount,
  adapters: ['table stripe/hover/border','overlay elevation','animation timing','warning surface semantic variables'], composition: ['WorkCalendar: stock ToggleButton/Chip/ProgressBar with disclosed layout-only utilities'], errors };
const output=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check')) {
  if(readFileSync('apps/web/src/preview/audit.generated.json','utf8')!==output) errors.push('Audit report stale. Run npm run tokens:audit.');
} else writeFileSync('apps/web/src/preview/audit.generated.json',output);
if(errors.length) throw Error(errors.join('\n'));
console.log(`PASS: ${buttonSkinSelectors} component skin selectors; ${rawColors} raw CSS colors; legacy CSS removed. ${selectorCount} layout/adapter selectors disclosed.`);
