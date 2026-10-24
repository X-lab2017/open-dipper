import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeMetric,identity,sourceUrl,fetchJson,rankWithinPlatform,selected,metrics} from '../scripts/fetch-data.mjs';
test('only month keys; year, quarter, raw and malformed month excluded',()=>{
 const result=normalizeMetric({'2025':100,'2025Q1':20,'2025-01':3,'2025-02':0,'2025-13':7,'2025-2':6,'2021-10-raw':5});
 assert.deepEqual(result.points,[{month:'2025-01',value:3,flags:[]},{month:'2025-02',value:0,flags:[]}]);
 assert.equal(result.latestMonth,'2025-02');
});
test('explicit zero stays zero; missing months stay absent',()=>{
 const result=normalizeMetric({'2025-01':0,'2025-03':5});
 assert.equal(result.points[0].value,0);assert.equal(result.points.some(p=>p.month==='2025-02'),false);
});
test('24 calendar months, not 24 arbitrarily sparse points',()=>{
 const result=normalizeMetric({'2023-09':1,'2023-10':2,'2025-09':3});
 assert.deepEqual(result.points.map(p=>p.month),['2023-10','2025-09']);
});
test('interpolation warning retained whenever October 2021 included',()=>{
 assert.deepEqual(normalizeMetric({'2021-10':3,'2021-10-raw':1}).points[0].flags,['potential_interpolation']);
});
test('negative, string, array, null, nonfinite excluded, not coerced',()=>{
 const result=normalizeMetric({'2025-01':1,'2025-02':-2,'2025-03':'3','2025-04':null,'2025-05':NaN,'2025-06':Infinity,'2025-07':[]});
 assert.equal(result.latestMonth,'2025-01');assert.equal(result.invalidMonths.length,6);
 assert.equal(normalizeMetric([]).status,'invalid');assert.equal(normalizeMetric({'2025':5}).status,'empty');
});
test('platform + repo + verified id identity; no invented IDs',()=>{
 assert.equal(identity('github','a/b',{type:'repo',id:42}).key,'github:repo:42');
 assert.notEqual(identity('gitlab','a/b',{type:'repo',id:42}).key,identity('github','a/b',{type:'repo',id:42}).key);
 for(const meta of [undefined,{type:'user',id:2},{type:'repo',id:-1},{type:'repo',id:0}])assert.equal(identity('gitlab','a/b/c',meta).id,null);
 assert.equal(identity('gitlab','a/b/c',null).key,'gitlab:unresolved-path:a/b/c');
 assert.equal(sourceUrl('gitlab','a/b/c','meta'),'https://oss.open-digger.cn/gitlab/a/b/c/meta.json');
});
test('404 is unavailable, never a zero or a missing project claim',async()=>{
 const result=await fetchJson('https://example.test',{fetchImpl:async()=>new Response('',{status:404})});
 assert.equal(result.status,'not_exported');assert.equal(result.provenance.httpStatus,404);assert.equal(result.data,undefined);
});
test('failed read vs malformed JSON vs successful zero',async()=>{
 assert.equal((await fetchJson('x',{fetchImpl:async()=>{throw Error('offline');}})).status,'fetch_error');
 assert.equal((await fetchJson('x',{fetchImpl:async()=>new Response('not-json')})).status,'invalid');
 const result=await fetchJson('x',{fetchImpl:async()=>new Response('{"2025-01":0}')});
 assert.equal(result.status,'ok');assert.equal(result.provenance.sha256.length,64);assert.equal(result.data['2025-01'],0);
});
test('single platform rankings require actual selected month, no cross-platform sum',()=>{
 const repos=[{key:'a',platform:'github',metrics:{stars:{points:[{month:'2025-01',value:0}]}}},{key:'b',platform:'gitlab',metrics:{stars:{points:[{month:'2025-01',value:99}]}}}];
 assert.throws(()=>rankWithinPlatform(repos,'all','stars','2025-01'));
 assert.deepEqual(rankWithinPlatform(repos,'github','stars','2025-01'),[{key:'a',value:0}]);
 assert.deepEqual(rankWithinPlatform(repos,'github','stars','2025-02'),[]);
});
test('curated selection is fixed at 20; six metric contracts',()=>{assert.equal(selected.length,20);assert.equal(metrics.length,6);assert.equal(selected.filter(r=>r.platform==='github').length,17);});
test('bundled real snapshot has complete provenance and valid per-metric monthly data',async()=>{
 const {readFile}=await import('node:fs/promises');
 const snapshot=JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8'));
 assert.equal(snapshot.repositories.length,20);
 assert.equal(new Set(snapshot.repositories.map(r=>r.key)).size,20);
 for(const repo of snapshot.repositories){
  assert.equal(repo.identity.platform,repo.platform);assert.equal(repo.identity.entityType,'repo');
  assert.equal(Object.keys(repo.metrics).length,6);
  for(const series of Object.values(repo.metrics)){
   assert.ok(series.provenance.url.startsWith('https://oss.open-digger.cn/'));
   assert.ok(!Number.isNaN(Date.parse(series.provenance.fetchedAt)));
   if(series.status==='ok'){
    assert.match(series.provenance.sha256,/^[0-9a-f]{64}$/);
    assert.equal(series.latestMonth,series.points.at(-1).month);
    assert.ok(series.points.length<=24);
    for(const point of series.points){assert.match(point.month,/^\d{4}-(0[1-9]|1[0-2])$/);assert.ok(Number.isFinite(point.value)&&point.value>=0);}
   }else{assert.equal(series.latestMonth,null);assert.deepEqual(series.points,[]);}
  }
 }
});
