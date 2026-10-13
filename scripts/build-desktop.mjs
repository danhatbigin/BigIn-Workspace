import { build } from 'esbuild';
await build({entryPoints:['packages/op/live.ts'],outfile:'apps/desktop/live.cjs',bundle:true,platform:'node',format:'cjs',target:'node24'});
console.log('Built main-only OpenProject adapter.');
