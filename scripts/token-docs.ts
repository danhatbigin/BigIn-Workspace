import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { defaultSettings, resolveTheme, exportCss, exportTokens, componentMapping } from '../packages/design-tokens/src/theme';
import inventory from '../packages/design-tokens/src/component-inventory.json';
const directory='docs/design-system';mkdirSync(directory,{recursive:true});
const escape=(v:unknown)=>String(v).replaceAll('|','\\|').replaceAll('\n',' ');
const outputs:Record<string,string>={};
let registry='# Token registry — generated\n\nSource: packages/design-tokens/src/theme.ts and bds-source.json. Draft, not owner-approved production tokens. Run npm run tokens:docs; do not maintain values manually.\n\n';
for(const preset of ['neutral','bds'] as const)for(const mode of ['light','dark'] as const){
  const config={...defaultSettings,preset,mode};const theme=resolveTheme(config);
  registry+=`## ${preset} / ${mode}\n\n| Token | Value | Alias | CSS variable | Provenance |\n|---|---|---|---|---|\n`+theme.tokens.map(t=>`| ${escape(t.name)} | ${escape(t.value)} | ${escape(t.alias??'—')} | ${escape(t.css??'Reference only')} | ${escape(t.source)} |`).join('\n')+'\n\n';
  outputs[`${directory}/${preset}-${mode}.tokens.json`]=JSON.stringify(exportTokens(config),null,2)+'\n';
  outputs[`${directory}/${preset}-${mode}.css`]=exportCss(config);
}
outputs[`${directory}/TOKEN-REGISTRY.generated.md`]=registry;
outputs[`${directory}/COMPONENT-MAPPING.generated.md`]='# Component mapping — generated\n\n## HeroUI bridge\n\n| Family | Components | Tokens | Scope / limits |\n|---|---|---|---|\n'+componentMapping.map(r=>`| ${escape(r.family)} | ${escape(r.components)} | ${escape(r.tokens)} | ${escape(r.note)} |`).join('\n')+'\n\n## BDS source inventory\n\nStructure scanned across all pages; not a runtime interaction audit. Component counts include variants.\n\n'+inventory.map(page=>`### ${page.page}\n\n${page.nodeCount} nodes · ${page.componentCount} component nodes.\n\n`+(page.componentSets.length?page.componentSets.map(set=>`- ${set.name} — ${set.variants} variants; axes: ${set.properties.map(p=>p.replace(/#.*$/,'')).join(', ')}. Node ${set.id}.`).join('\n'):'No component set on this page; source examples or standalone components.')+'\n').join('\n');
for(const[file,content]of Object.entries(outputs)){
  if(process.argv.includes('--check')){if(readFileSync(file,'utf8')!==content)throw Error(`${file} stale; run npm run tokens:docs.`);}
  else writeFileSync(file,content);
}
console.log(`${process.argv.includes('--check')?'Verified':'Generated'} ${Object.keys(outputs).length} design-system artifacts from source.`);
