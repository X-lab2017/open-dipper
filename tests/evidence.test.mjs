import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {adaptEvidence,keys} from '../scripts/build-evidence.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const evidence=await read('public/data/evidence.json'),anchors=await read('config/country-anchors.json'),supply=await read('data/reference/gosd-supply.json');
const inputs=Object.fromEntries(await Promise.all(keys.map(async k=>[k,await read('data/reference/openshare-'+k+'.json')])));
const source=await fs.readFile(new URL('../src/observatory/evidence.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('observed totals retain explicit source clocks, independent of regional sums',()=>{
 assert.equal(m.validateEvidence(evidence),true);
 const e=adaptEvidence(inputs,anchors,supply);
 assert.deepEqual(e.globalDevelopers,{value:180145424,year:'2025',sourceKey:'developers'});
 assert.equal(e.supply.asOf,'2026-10-16');assert.equal(e.supply.models,3158803);assert.equal(e.supply.datasets,1093040);assert.equal(e.supply.monthly.at(-1).month,'2026-07');
 assert.deepEqual(keys.map(k=>e.maps[k].rows.length),[224,236,30]);
 for(const k of keys){assert.equal(e.maps[k].observedPeriod,null);assert.equal(e.maps[k].unknownRegionTotal,null);}
 const reduced=structuredClone(inputs);reduced.developers.leaderboard.data.pop();assert.equal(adaptEvidence(reduced,anchors,supply).globalDevelopers.value,180145424);
});
test('coordinates are map labels, not inferred; missing anchors and metrics remain absent',()=>{
 const countries=m.atlasCountries(evidence,'developers');const reunion=countries.find(c=>c.sourceCode==='RE');
 assert.equal(reunion.longitude,null);assert.equal(reunion.latitude,null);assert.ok(reunion.atlasValue>0);assert.equal(reunion.openrank,undefined);
 assert.equal(countries.find(c=>c.sourceCode==='AU').longitude,134.04972);assert.equal(anchors.rows.filter(r=>r.code==='AU').length,1);
 assert.ok(countries.every(c=>c.atlasValue===evidence.maps.developers.rows.find(r=>r.code===c.sourceCode).value));
});
test('adapter rejects invalid observations, duplicate identifiers and inconsistent clocks',()=>{
 for(const mutation of [x=>x.developers.leaderboard.data[0].value=-1,x=>x.developers.leaderboard.data.push(x.developers.leaderboard.data[0]),x=>x.developers.trend.labels.pop()]){const x=structuredClone(inputs);mutation(x);assert.throws(()=>adaptEvidence(x,anchors,supply));}
 for(const mutation of [x=>x.meta.containsSimulatedData=true,x=>x.models.summary.last_updated='2026-01-01',x=>x.models.monthlyNew.push(x.models.monthlyNew[0])]){const x=structuredClone(supply);mutation(x);assert.throws(()=>adaptEvidence(inputs,anchors,x));}
 assert.throws(()=>adaptEvidence(inputs,{...anchors,rows:[...anchors.rows,anchors.rows[0]]},supply));
});
test('calendar windows expose gaps without padding observations or treating zero as missing',()=>{
 const x=structuredClone(evidence);x.supply.monthly=x.supply.monthly.filter(r=>r.month!=='2026-06');x.supply.monthly.at(-1).models=0;
 const rows=m.supplyWindow(x);assert.equal(rows.length,12);assert.equal(rows[0].month,'2025-08');assert.equal(rows.at(-1).month,'2026-07');assert.equal(rows.at(-2).models,null);assert.equal(rows.at(-1).models,0);
 const sparse=structuredClone(supply);sparse.models.monthlyNew.pop();const e=adaptEvidence(inputs,anchors,sparse);assert.equal(e.supply.monthly.at(-1).models,null);assert.equal(e.supply.monthly.at(-1).datasets,23811);
});
test('client rejects untrusted shape, unsafe source links and mixed or future observations atomically',()=>{
 for(const mutation of [x=>x.dataStatus='demo',x=>x.maps.developers.source.url='javascript:alert(1)',x=>x.maps.developers.rows[0].latitude=91,x=>x.maps.developers.rows[0].value=null,x=>x.maps.developers.rows.push(x.maps.developers.rows[0]),x=>x.supply.source.commit='main',x=>x.supply.monthly.at(-1).month='2026-13',x=>x.supply.monthly.at(-1).month='2027-01',x=>x.supply.monthly[0].models=-1]){const x=structuredClone(evidence);mutation(x);assert.equal(m.validateEvidence(x),false);}
});
test('unavailable optional evidence never blocks core observations or substitutes fixtures',async()=>{
 const original=globalThis.fetch;
 try{for(const response of [async()=>({ok:false}),async()=>({ok:true,json:async()=>({dataStatus:'demo'})}),async()=>{throw Error('offline')}]){globalThis.fetch=response;assert.equal(await m.loadEvidence('/'),null);}}
 finally{globalThis.fetch=original;}
});
