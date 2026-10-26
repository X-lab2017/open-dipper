import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const tokens=JSON.parse(await fs.readFile('design/tokens.json','utf8'));
const luminance=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const moduleUrl=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64');
const paletteUrl=moduleUrl(await fs.readFile('src/design/palette.ts','utf8'));
const m=await import(moduleUrl((await fs.readFile('src/design/scales.ts','utf8')).replace("'./palette'",JSON.stringify(paletteUrl))));
test('both themes keep primary, secondary, muted, action and dynamic text readable on panel surfaces',()=>{
 for(const [mode,p] of Object.entries(tokens.themes)) for(const key of ['text','text-secondary','text-muted','accent','warning','pulse-people','pulse-commits','pulse-models','pulse-datasets','pulse-papers']) for(const surface of ['surface-page','surface-panel','surface-input']) assert.ok(contrast(p[key],p[surface])>=4.5,`${mode} ${key} on ${surface}: ${contrast(p[key],p[surface])}`);
});
test('area ramps are monotonic in luminance and shared exactly by map and legend',()=>{
 for(const metric of ['developers','contribution','talent','influence'])for(const light of [false,true]){
  const stops=m.metricRamp(metric,light),values=Array.from({length:101},(_,i)=>luminance(m.sampleRamp(stops,i/100)));
  assert.ok(values.every((v,i)=>!i||(light?v<=values[i-1]:v>=values[i-1])),`${metric} ${light}`);
  assert.equal(m.metricFill(metric,light,0,100),stops[0].toLowerCase());assert.equal(m.metricFill(metric,light,100,100),stops.at(-1).toLowerCase());
  assert.ok(stops.every(c=>m.legendRamp(metric,light).includes(c)));
  assert.equal(m.metricFill(metric,light,null,100),tokens.themes[light?'light':'dark']['map-unobserved']);
  assert.notEqual(m.metricFill(metric,light,null,100),m.metricFill(metric,light,0,100));
 }
});
test('every layer has paired text and marker colors for both themes',()=>{
 assert.equal(Object.keys(tokens.layerTones).length,18);
 for(const [layer,tones] of Object.entries(tokens.layerTones))for(const mode of ['dark','light'])assert.ok(contrast(tones[mode],tokens.themes[mode]['surface-panel'])>=4.5,`${mode} ${layer}`);
});

test('radar categories and numbered targets retain text contrast in both themes',()=>{
 for(const [mode,p] of Object.entries(tokens.themes))for(const key of ['chart-activity','chart-contribution','event-community','event-foundation']){
  assert.ok(contrast(p[key],p['surface-panel'])>=4.5,`${mode} ${key} label`);
  assert.ok(contrast(p[key],p['text-inverse'])>=4.5,`${mode} ${key} target number`);
 }
});
