/** Generate CSS and Canvas palettes from one maintained token registry. */
import fs from 'node:fs/promises';
const t=JSON.parse(await fs.readFile('design/tokens.json','utf8'));
const props=(o,p='')=>Object.entries(o).map(([k,v])=>`  --od-${p}${k}: ${v};`).join('\n');
const aliases={bg:'surface-page',panel:'surface-panel',raised:'surface-raised',line:'border-subtle',sub:'text-muted',text:'text',accent:'accent',soft:'accent-soft',amber:'warning'};
const css=`/* Generated from design/tokens.json · OpenDipper Visual Baseline ${t.version}. */\n:root {\n${props(t.brand,'brand-')}\n${props(t.type,'font-')}\n${props(t.space,'space-')}\n${props(t.shape)}\n${props(t.motion,'motion-')}\n${props(t.themes.dark)}\n${Object.entries(aliases).map(([a,b])=>`  --${a}: var(--od-${b});`).join('\n')}\n  color-scheme: dark;\n}\n:root[data-theme="light"] {\n${props(t.themes.light)}\n  color-scheme: light;\n}\n`;
const ts=`// Generated from design/tokens.json; do not edit here.\nexport const palettes = ${JSON.stringify(t.themes,null,2)} as const;\nexport const metricHues:Record<string,number> = ${JSON.stringify(t.metricHues)};\nexport const canvasPalette=(light:boolean)=>palettes[light?'light':'dark'];\nexport const chartColor=(metric:string,light:boolean)=>{const p=canvasPalette(light);return metric==='activity'||metric==='participants'||metric==='developers'?p['chart-activity']:metric==='change_requests_accepted'||metric==='contributors'?p['chart-contribution']:p['chart-influence'];};\n`;
const outputs={'src/design/tokens.css':css,'src/design/palette.ts':ts,'public/design-system/components.css':await fs.readFile('src/design/components.css','utf8'),'public/design-system/tokens.css':css,'public/design-system/tokens.json':JSON.stringify(t,null,2)+'\n'};
const check=process.argv.includes('--check');
for(const [path,content]of Object.entries(outputs)){if(check){if(await fs.readFile(path,'utf8')!==content)throw Error(`${path} is not current; run npm run design:build`);}else await fs.writeFile(path,content);}
console.log(check?'Design token outputs are current':'Generated shared CSS, Canvas palette and reusable token registry');
