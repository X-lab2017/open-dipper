import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {adaptObservation} from '../scripts/build-observation.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const module=async p=>{const source=await fs.readFile(new URL('../'+p,import.meta.url),'utf8');return import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64'));};
const w=await module('src/observatory/workspace.ts'),m=await module('src/observatory/model.ts');
const observation=await read('public/data/observation.json'),labels=await read('data/reference/labeled-organizations.json'),supply=await read('data/reference/gosd-geography.json'),anchors=await read('config/country-anchors.json');
test('pinned organization labels and explicit repository identities remain distinct scopes',()=>{
 assert.equal(w.validateObservation(observation),true);assert.deepEqual(adaptObservation(labels,supply,anchors),observation);
 assert.equal(observation.organizations.total,508);assert.deepEqual(observation.organizations.groups,{company:405,research:24,foundation:34,community:42,public:3});assert.equal(observation.repositories.count,13019);
 assert.equal(observation.facilities.count,null);assert.equal(observation.facilities.status,'not_connected');
});
test('publisher sample retains totals, missing countries and independent clocks',()=>{
 assert.equal(observation.publisher.maps.models.total,73088);assert.equal(observation.publisher.maps.datasets.total,12502);
 for(const k of ['models','datasets']){const map=observation.publisher.maps[k];assert.equal(map.observedPeriod,null);assert.equal(map.organizations,826);assert.equal(map.rows.filter(r=>r.value===null).length,11);const countries=w.publisherCountries(observation,k,'value');assert.ok(countries.some(c=>c.atlasValue===undefined));assert.equal(countries.find(c=>c.sourceCode==='US').atlasValue,k==='models'?46314:5938);}
});
test('audience presets have meaningful combinations and preserve developer/project semantics',()=>{
 assert.equal(Object.keys(w.viewpoints).length,6);assert.equal(w.viewpoints.developer.layer,'contribution');assert.equal(w.viewpoints.enterprise.layer,'influence');assert.equal(w.viewpoints.researcher.layer,'models');assert.equal(w.viewpoints.foundation.layer,'community');
 for(const p of Object.values(w.viewpoints)){assert.ok(w.layerNames[p.layer]);assert.ok(p.categories.every(c=>m.categories[c]));assert.equal(new Set(p.categories).size,p.categories.length);}
 assert.equal(w.parseViewpoint('__proto__'),'global');assert.equal(w.parseViewpoint({}),'global');assert.equal(w.parseViewpoint('custom'),'custom');assert.deepEqual(w.objectLayers.developer,['developers','contribution']);assert.deepEqual(w.objectLayers.project,['influence']);
});
test('malformed optional snapshots cannot introduce facility counts, invalid geography or corrupted totals',()=>{
 for(const mutate of [x=>x.organizations.total++,x=>x.organizations.groups.company=-1,x=>x.publisher.maps.models.rows.push(x.publisher.maps.models.rows[0]),x=>x.publisher.maps.models.rows[0].latitude=100,x=>x.publisher.maps.models.rows[0].value=null,x=>x.publisher.maps.models.total++,x=>x.publisher.source.url='javascript:alert(1)',x=>x.facilities.count=0]){const x=structuredClone(observation);mutate(x);assert.equal(w.validateObservation(x),false);}
 const bad=structuredClone(labels);bad.labels.push(bad.labels[0]);assert.throws(()=>adaptObservation(bad,supply,anchors));
});
test('optional observation failure never invents data',async()=>{const original=globalThis.fetch;try{for(const fetch of [async()=>({ok:false}),async()=>({ok:true,json:async()=>({schemaVersion:1})}),async()=>{throw Error('offline')}]){globalThis.fetch=fetch;assert.equal(await w.loadObservation('/'),null);}}finally{globalThis.fetch=original;}});
test('China scope includes Taiwan while raw region values and distinct rows remain intact',()=>{
 for(const code of ['TW','TWN','CN-TW']){assert.equal(m.regionGroup(code),'CHN');assert.equal(m.countryName({rawCode:code,country:'Taiwan'},'zh'),'中国台湾');assert.equal(m.locationName({countryCode:code,name:'Taiwan'},'en'),'Taiwan, China');assert.equal(m.regionMatches(code,'CHN'),true);}
 assert.equal(m.regionMatches('CHN','TWN'),false);assert.equal(m.regionMatches('USA','CHN'),false);
 const rows=[{code:'CN'},{code:'TW'}];assert.equal(w.coverageRegions([{rows}]),2);assert.deepEqual(rows,[{code:'CN'},{code:'TW'}]);
 const e={id:'tw',title:'event',summary:'',tags:[],location:{countryCode:'TWN'},provenance:'automatic',category:'research',severity:'info',occurredAt:'2026-10-01'};
 assert.equal(m.filterEvents([e],{demo:false,category:'all',query:'',days:0,region:'CHN',severity:'all'}).length,1);
});
