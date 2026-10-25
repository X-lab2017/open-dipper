import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source=await fs.readFile(new URL('../src/observatory/intelligence.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const fixture=JSON.parse(await fs.readFile(new URL('../public/data/intelligence-demo.json',import.meta.url),'utf8'));
const feed=JSON.parse(await fs.readFile(new URL('../public/data/events.json',import.meta.url),'utf8'));
test('intelligence fixtures remain bilingual, fixed and fictional with distinct identifiers',()=>{
  assert.ok(m.validateIntelligence(fixture));assert.equal(fixture.signals.length,8);
  assert.equal(fixture.fixtureDate,'2026-10-24T15:00:00Z');
  for(const s of fixture.signals){assert.equal(s.provenance,'demo');assert.equal(s.sourceUrl,'');assert.ok(!s.repository);assert.ok(!feed.events.some(e=>e.id===s.id));}
});
test('malformed or factual-looking fixtures are rejected atomically',()=>{
  for(const change of [{provenance:'automatic'},{id:'real-event'},{sourceUrl:'https://example.org'},{topic:'constructor'},{publishedAt:'now'},{summary:{zh:'only'}},{location:{name:'x',countryCode:'X',precision:'simulated',lon:181,lat:0}},{evidence:[{kind:{zh:'x',en:'x'},status:{zh:'x',en:'x'},url:'javascript:alert(1)'}]}]){
    const bad=structuredClone(fixture);Object.assign(bad.signals[0],change);assert.equal(m.validateIntelligence(bad),false);
  }
  assert.equal(m.validateIntelligence({...fixture,signals:[fixture.signals[0],fixture.signals[0]]}),false);
});
test('AI indexing uses exact configured repositories or explicit tags, not source reputation or keywords',()=>{
  const e={...feed.events[0],provenance:'automatic',tags:[],repository:null,title:'AI agent benchmark'};
  assert.equal(m.topicForEvent(e),null);
  assert.equal(m.topicForEvent({...e,repository:'vllm-project/vllm'}),'models');
  assert.equal(m.topicForEvent({...e,repository:'not-vllm-project/vllm'}),null);
  assert.equal(m.topicForEvent({...e,tags:['ai-topic:research']}),'research');
  assert.equal(m.topicForEvent({...e,tags:['ai-topic:constructor']}),null);
  assert.equal(m.topicForEvent({...e,repository:'pytorch/pytorch',provenance:'demo'}),null);
});
test('collected evidence retains original times, source and unknown geography',()=>{
  const e={...feed.events[0],repository:'pytorch/pytorch',location:null,provenance:'automatic'};
  const s=m.signalFromEvent(e);assert.equal(s.location,null);assert.equal(s.publishedAt,e.occurredAt);assert.equal(s.capturedAt,e.collectedAt);assert.equal(s.sourceUrl,e.sourceUrl);assert.equal(s.provenance,'automatic');assert.match(s.why.en,/pending/);
});
test('demo-off applies before following, export and topic filtering',()=>{
  const signals=m.signalsFor(feed.events,fixture,false);assert.ok(signals.length>0);assert.ok(signals.every(s=>s.provenance!=='demo'));
  const prefs=m.preferencesFrom({topics:['agents'],saved:[fixture.signals[0].id]});
  assert.ok(m.matchingSignals(signals,prefs,[]).every(s=>s.provenance!=='demo'));
  assert.ok(!m.exportBrief(signals,'en','weekly').includes('Aurora-8B'));
  assert.equal(m.filterSignals(fixture.signals,'research','reproduction').length,2);
});
test('preferences sanitize untrusted storage, cap saves and retain no contact or payment data',()=>{
  assert.deepEqual(m.preferencesFrom('broken'),m.defaultPreferences);
  const p=m.preferencesFrom({topics:['agents','agents','constructor',5],saved:['a','a',null,...Array.from({length:300},(_,i)=>String(i))],cadence:'hourly',demo:false,email:'private@example.org'});
  assert.deepEqual(p.topics,['agents']);assert.equal(p.saved.length,200);assert.equal(p.cadence,'weekly');assert.equal(p.demo,false);assert.equal(p.email,undefined);
});
test('personal matching is a union of exact repository, topic and saved signals without duplicates',()=>{
  const s={...fixture.signals[0],repository:'pytorch/pytorch'};
  assert.equal(m.matchingSignals([s],{topics:['models'],saved:[s.id]},['pytorch/pytorch']).length,1);
  assert.equal(m.matchingSignals([s],{topics:[],saved:[]},['pytorch']).length,0);
  assert.equal(m.matchingSignals([s],{topics:[],saved:[]},['pytorch/pytorch']).length,1);
});
test('demo map adapters preserve fictional locations and do not invent absent ones',()=>{
  assert.equal(m.asDemoEvent(fixture.signals[0]).location,null);
  const e=m.asDemoEvent(fixture.signals[1]);assert.equal(e.provenance,'demo');assert.equal(e.reviewStatus,'demo');assert.equal(e.location.precision,'simulated');assert.equal(e.occurredAt,fixture.signals[1].publishedAt);
});
test('routes are allowlisted and exported briefs explicitly identify fictional examples',()=>{
  assert.equal(m.parsePage('#radar'),'radar');assert.equal(m.parsePage('#constructor'),'overview');assert.equal(m.parsePage('#/briefing'),'briefing');
  for(const lang of ['en','zh']){const out=m.exportBrief(fixture.signals,lang,'weekly');assert.match(out,/\[DEMO\]/);assert.match(out,/2026-10-24/);assert.ok(out.includes(lang==='en'?'not a fresh collection':'不代表新采集'));}
});
test('an unavailable or malformed optional fixture never substitutes data',async()=>{
  const original=globalThis.fetch;
  try{
    globalThis.fetch=async()=>({ok:false});assert.equal(await m.loadIntelligence('/'),null);
    globalThis.fetch=async()=>({ok:true,json:async()=>({signals:[]})});assert.equal(await m.loadIntelligence('/'),null);
    globalThis.fetch=async()=>{throw new Error('offline')};assert.equal(await m.loadIntelligence('/'),null);
    assert.deepEqual(m.signalsFor([],null,true),[]);
  }finally{globalThis.fetch=original;}
});
