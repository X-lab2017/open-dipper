import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const js=ts.transpileModule(await fs.readFile('src/galaxy/model.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const code=JSON.parse(await fs.readFile('public/data/galaxy/code.json'));
const model=JSON.parse(await fs.readFile('public/data/galaxy/model.json'));
const index=m.buildIndex({code,model});
const filter={mode:'all',category:'',kind:'all',query:'',inferred:false,relation:'all',watchedOnly:false};
test('full graph loads without fabricated cross-source links or lost node identities',()=>{
 assert.ok(m.validGraph(code));assert.ok(m.validGraph(model));
 assert.equal(index.nodes.length,43771);assert.equal(index.edges.length,149913);assert.equal(index.byKey.size,43771);
 assert.ok(index.edges.every(e=>index.nodes[e.source].source===index.nodes[e.target].source));
 assert.ok(index.nodes.every(n=>Number.isFinite(n.gx)&&Number.isFinite(n.gy)&&n.score>=0&&n.score<=1));
 assert.ok(index.nodes.filter(n=>n.source==='code').every(n=>n.gx<0));
 assert.ok(index.nodes.filter(n=>n.source==='model').every(n=>n.gx>0));
});
test('inferred model edges are excluded by default and can be inspected independently',()=>{
 assert.equal(index.edges.filter(e=>m.allowedLink(e,filter)).length,125955);
 assert.equal(index.edges.filter(e=>m.allowedLink(e,{...filter,inferred:true})).length,149913);
 assert.ok(index.edges.filter(e=>m.allowedLink(e,{...filter,relation:'base-model'})).every(e=>!e.inferred));
 assert.equal(index.edges.filter(e=>m.allowedLink(e,{...filter,relation:'inferred-task'})).length,0);
});
test('domain, entity, query and local watch filters compose without rewriting the network',()=>{
 assert.equal(m.filteredNodes(index,{...filter,mode:'code'},new Set()).length,19771);
 assert.equal(m.filteredNodes(index,{...filter,kind:'dataset'},new Set()).length,7000);
 const p=m.filteredNodes(index,{...filter,query:'pytorch/pytorch'},new Set());assert.equal(p.length,1);
 assert.equal(m.filteredNodes(index,{...filter,watchedOnly:true},new Set([index.nodes[p[0]].key])).length,1);
 assert.equal(m.filteredNodes(index,{...filter,query:'no-such-entity-xyz'},new Set()).length,0);
 const neighbors=m.connectedNodes(index,p[0],filter);assert.ok(neighbors.length>0);assert.ok(neighbors.some(x=>index.nodes[x.node].name==='vllm-project/vllm'));
 assert.equal(index.nodes.length,43771);
});
test('radar URL lookup and snapshot dates preserve source identity and clocks',()=>{
 assert.equal(index.nodes[m.findByUrl(index,'https://github.com/pytorch/pytorch/')].name,'pytorch/pytorch');
 assert.equal(m.findByUrl(index,'https://example.org/pytorch/pytorch'),-1);
 assert.equal(m.scopeDate(code),'2025.08—2026.07');assert.equal(m.scopeDate(model),'2026-08-05');
});
test('malformed graph payloads fail closed; partial sources remain usable',()=>{
 assert.equal(m.validGraph({...code,meta:{...code.meta,nodeCount:0}}),false);
 assert.equal(m.validGraph({...code,edges:[[0,999999,1,0,2,0]]}),false);
 const bad={...code,nodes:code.nodes.map((n,i)=>i? n:{...n,x:NaN})};assert.equal(m.validGraph(bad),false);
 assert.equal(m.buildIndex({model}).nodes.length,24000);assert.equal(m.buildIndex({}).nodes.length,0);
});

const dataModule=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const paletteJS=ts.transpileModule(await fs.readFile('src/design/palette.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const sceneJS=ts.transpileModule(await fs.readFile('src/galaxy/scene.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace("'../design/palette'",JSON.stringify(dataModule(paletteJS))).replace("'./model'",JSON.stringify(dataModule(js)));
const {GalaxyScene,galaxyTone}=await import(dataModule(sceneJS));
const {palettes}=await import(dataModule(paletteJS));
test('galaxy chroma derives from shared theme colors without changing readable text tokens',()=>{
 const chroma=hex=>{const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return Math.max(...rgb)-Math.min(...rgb);};
 for(const light of [false,true])for(const key of ['accent','event-release','warning','positive','event-community','event-research','manual','chart-influence']){
  const token=palettes[light?'light':'dark'][key],tone=galaxyTone(token,light);
  assert.match(tone,/^#[0-9a-f]{6}$/);assert.ok(chroma(tone)>chroma(token),`${light?'light':'dark'} ${key} is more vivid`);
 }
 assert.equal(palettes.light.text,'#203540');assert.equal(palettes.dark.text,'#E2EBF0');
});
test('bounded overview effects obey motion toggle, live reduced motion, hidden page and disposal',()=>{
 const names=['document','matchMedia','ResizeObserver','requestAnimationFrame','cancelAnimationFrame','devicePixelRatio'],originals=new Map(names.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 const listeners=new Map(),frames=new Map();let next=0;
 const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),measureText:t=>({width:t.length*6})},{get:(o,k)=>k in o?o[k]:noop});
 const preference={matches:false,addEventListener:(type,fn)=>listeners.set('motion:'+type,fn)};
 const canvas=()=>({width:0,height:0,dataset:{},className:'',getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:700,left:0,top:0}),insertAdjacentElement:noop,setAttribute:noop,addEventListener:noop,remove:noop,closest:()=>({style:{setProperty:noop}})});
 const doc={hidden:false,createElement:canvas,addEventListener:(type,fn)=>listeners.set(type,fn)};
 const mocks={document:doc,matchMedia:()=>preference,ResizeObserver:class{observe(){} disconnect(){}},requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id),devicePixelRatio:1};
 let scene;
 try{
  for(const [key,value] of Object.entries(mocks))Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
  const tiny={...index,nodes:index.nodes.slice(0,2),edges:[],neighbors:new Map(),graphs:{},byKey:new Map()};
  scene=new GalaxyScene(canvas(),tiny,{filter,visible:[0,1],selected:-1,light:true,lang:'en',motion:true,onSelect:noop,onHover:noop,onInteract:noop,onCamera:noop});
  assert.ok(scene.fxRaf>0,'overview animates before node selection');assert.equal(scene.fx.dataset.motionState,'running');assert.equal(scene.fxLinks.length,0,'overview invents no relationship particles');
  scene.update({motion:false});assert.equal(scene.fxRaf,0);assert.equal(scene.fx.dataset.motionState,'paused');
  scene.update({motion:true});assert.ok(scene.fxRaf>0);
  listeners.get('motion:change')({matches:true});assert.equal(scene.fxRaf,0);assert.equal(scene.fx.dataset.motionState,'reduced');
  listeners.get('motion:change')({matches:false});assert.ok(scene.fxRaf>0);
  doc.hidden=true;listeners.get('visibilitychange')();assert.equal(scene.fxRaf,0);assert.equal(scene.fx.dataset.motionState,'hidden');
  doc.hidden=false;listeners.get('visibilitychange')();assert.ok(scene.fxRaf>0);
  scene.destroy();assert.equal(frames.size,0,'all scheduled base, camera and effect frames are cancelled');
 }finally{scene?.destroy();for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});
