import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const js=ts.transpileModule(await fs.readFile('src/observatory/tour.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {ObservatoryTour,tourStops}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
function fixture(){const pending=new Map();let sequence=0;const visited=[];const tour=new ObservatoryTour(i=>visited.push(i),()=>{}, {set:(f,ms)=>{assert.equal(ms,10000);pending.set(++sequence,f);return sequence;},clear:id=>pending.delete(id)});return {tour,pending,visited,tick(){const [id,fn]=pending.entries().next().value;pending.delete(id);fn();}};}
test('tour is opt-in, visits the five panels once and stops at the final panel',()=>{
 const f=fixture();assert.equal(f.tour.active,false);assert.equal(f.pending.size,0);f.tour.start(true);
 for(let i=0;i<4;i++){assert.equal(f.pending.size,1);f.tick();}
 assert.deepEqual(f.visited,[0,1,2,3,4]);assert.equal(f.pending.size,0);assert.equal(f.tour.playing,false);assert.equal(f.tour.active,true);
 f.tour.toggle();assert.equal(f.tour.index,0);assert.equal(f.pending.size,1);f.tour.stop();assert.equal(f.pending.size,0);assert.equal(f.tour.active,false);
});
test('manual/reduced-motion entry, pause, navigation and exit never leave duplicate timers',()=>{
 const f=fixture();f.tour.start(false);assert.equal(f.pending.size,0);f.tour.go(1);assert.equal(f.pending.size,0);
 f.tour.toggle();assert.equal(f.pending.size,1);f.tour.go(2);assert.equal(f.pending.size,1);f.tour.pause();f.tour.pause();assert.equal(f.pending.size,0);
 f.tour.go(-1);assert.equal(f.tour.index,0);f.tour.go(99);assert.equal(f.tour.index,4);f.tour.stop();f.tour.go(2);f.tour.toggle();assert.equal(f.tour.active,false);assert.equal(f.pending.size,0);
});
test('itinerary keeps requested panel order and only uses sourced anchors',async()=>{
 assert.deepEqual(tourStops.map(s=>s.layer),['developers','companies','benchmark','models','meetings']);
 assert.deepEqual(tourStops.map(s=>s.view),['map','globe','globe','map','globe']);
 const located=JSON.parse(await fs.readFile('public/data/located-entities.json','utf8'));
 for(const stop of tourStops.filter(s=>s.anchor)){const p=located.layers[stop.layer].find(p=>p.id===stop.anchor);assert.ok(p);assert.ok(p.sourceUrls.length);assert.ok(!p.demo);assert.ok(Number.isFinite(p.longitude)&&Number.isFinite(p.latitude));assert.ok(p.period.length);}
});
