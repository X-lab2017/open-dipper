import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const js=ts.transpileModule(await fs.readFile('src/radar/model.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const catalog=JSON.parse(await fs.readFile('public/data/radar-catalog.json','utf8'));
const demo=JSON.parse(await fs.readFile('public/data/radar-demo.json','utf8'));
test('sourced catalog and separately fixed demo retain independent clocks and identities',()=>{
 assert.ok(m.validateCatalog(catalog));assert.ok(m.validateDemo(demo,catalog));
 assert.deepEqual(['software','model','dataset'].map(k=>catalog.entities.filter(e=>e.kind===k).length),[12,12,6]);
 assert.equal(demo.fixtureDate,'2026-10-26T00:00:00Z');
 assert.ok(catalog.entities.every(e=>!('ring' in e)&&!('assessment' in e)));
 const code=catalog.entities.find(e=>e.name==='Codex');assert.equal(code.metrics.find(m=>m.id==='openrank').period,'2026-08');assert.equal(code.metrics.find(m=>m.id==='participants').period,'2026-07');assert.equal(code.metrics.find(m=>m.id==='stars').period,null);
 assert.ok(catalog.entities.filter(e=>e.kind!=='software').every(e=>e.version));
 const q=catalog.entities.find(e=>e.name==='Qwen3 · 0.6B');assert.equal(q.metrics[0].period,'2026-10-02 · 30d');
});
test('turning demos off or losing their file leaves real facts and no invented assessment',()=>{
 const s=m.freshState();const before=m.filteredEntities(catalog,s,demo);s.demo=false;
 assert.deepEqual(m.filteredEntities(catalog,s,demo),before);assert.equal(m.visibleAssessment(before[0].id,s,demo),null);
 s.demo=true;assert.equal(m.visibleAssessment(before[0].id,s,null),null);assert.equal(m.filteredEntities(catalog,s,null).length,12);
});
test('task, lens, category, type, watch and empty filters preserve source data',()=>{
 const s=m.freshState({lens:'assets'});assert.equal(m.filteredEntities(catalog,s,demo).length,18);s.kind='dataset';assert.equal(m.filteredEntities(catalog,s,demo).length,6);
 s.scenario='coding';assert.ok(m.filteredEntities(catalog,s,demo).every(e=>e.scenarios.includes('coding')));
 s.query='there-is-no-such-project';assert.equal(m.filteredEntities(catalog,s,demo).length,0);
 s.query='';s.scenario='all';s.onlyWatched=true;s.watched=[catalog.entities.find(e=>e.kind==='dataset').id];assert.equal(m.filteredEntities(catalog,s,demo).length,1);
 s.categories=[];assert.equal(m.filteredEntities(catalog,s,demo).length,0);
});
test('comparison accepts up to three same-kind candidates and supports removal across lenses',()=>{
 const soft=catalog.entities.filter(e=>e.kind==='software'),model=catalog.entities.find(e=>e.kind==='model');let ids=[];
 for(const e of soft.slice(0,3))ids=m.toggleCompare(ids,e.id,catalog).ids;
 assert.equal(m.toggleCompare(ids,soft[3].id,catalog).error,'limit');assert.equal(m.toggleCompare(ids,model.id,catalog).error,'mixed');
 ids=m.toggleCompare(ids,ids[0],catalog).ids;assert.equal(ids.length,2);assert.equal(m.toggleCompare(ids,soft[3].id,catalog).error,null);
});
test('month-over-month never spans unknowns, zero baselines or gaps',()=>{
 const metric=series=>({series});assert.equal(m.monthlyChange(metric([{period:'2025-12',value:10},{period:'2026-01',value:15}])),50);
 for(const series of [[{period:'2026-01',value:10},{period:'2026-03',value:15}],[{period:'2026-01',value:null},{period:'2026-02',value:15}],[{period:'2026-01',value:0},{period:'2026-02',value:15}]])assert.equal(m.monthlyChange(metric(series)),null);
});
test('placement is bounded and stable while filtering the same edition',()=>{
 const before=m.radarPositions(catalog,demo,'assets');const s=m.freshState({lens:'assets'});s.query='qwen';m.filteredEntities(catalog,s,demo);const after=m.radarPositions(catalog,demo,'assets');assert.deepEqual(after,before);
 for(const p of before.values())assert.ok(Math.hypot(p.x-340,p.y-320)<264);
});
test('bad URLs, duplicate IDs, invalid provenance and unsupported sources fail closed',()=>{
 for(const mutate of [c=>c.entities[0].url='javascript:alert(1)',c=>c.entities[1].id=c.entities[0].id,c=>c.entities[0].metrics[0].sourceId='unknown',c=>c.entities[0].metrics[0].value=-1]){const c=structuredClone(catalog);mutate(c);assert.equal(m.validateCatalog(c),false);}
 assert.equal(m.validateDemo({...demo,provenance:'observed'},catalog),false);
 assert.equal(m.validateDemo({...demo,assessments:[{...demo.assessments[0],entityId:'unknown'}]},catalog),false);
});
test('exports carry evidence dates, demo labels and local-only boundaries',()=>{
 const s=m.freshState(),e=catalog.entities[0];const text=m.exportRadar(catalog,[e],s,demo,'en');assert.match(text,/SIMULATED ADVICE/);assert.match(text,/2026-08/);assert.match(text,/Watches are local/);assert.ok(text.includes(catalog.sources.find(x=>x.id===e.sourceIds[0]).url));
 s.demo=false;const plain=m.exportRadar(catalog,[e],s,demo,'en');assert.doesNotMatch(plain,/\*\*SIMULATED ADVICE/);assert.match(plain,/pending review/);
});
test('untrusted saved state is bounded and cannot inject categories or prototype scenarios',()=>{
 const s=m.freshState({lens:'wrong',scenario:'toString',watched:['valid','valid','<script>'],demo:false,categories:[100],compare:['foo']});assert.equal(s.lens,'software');assert.equal(s.scenario,'all');assert.deepEqual(s.watched,['valid']);assert.deepEqual(s.compare,[]);assert.deepEqual(s.categories,[0,1,2,3]);
});
