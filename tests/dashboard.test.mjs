import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source=ts.transpileModule(await fs.readFile('src/dashboard.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const s=JSON.parse(await fs.readFile('public/data/dashboard-overview.json','utf8'));
test('GOSD totals retain exact values and distinguish source date from review date',()=>{
 assert.equal(s.upstream.summary.totalCountries,246);
 assert.equal(s.upstream.summary.totalDevelopers,193896100);
 assert.equal(s.upstream.summary.totalRepos,380657469);
 assert.equal(s.upstream.summary.totalRecords,9651850587);
 assert.equal(s.upstream.summary.activeDevelopers,28903652);
 assert.equal(s.upstream.summary.updatedAt,'2026-10-08T08:18:22.697Z');
 assert.equal(s.checkedAt,'2026-10-26');assert.match(s.upstream.sha256,/^[0-9a-f]{64}$/);
 assert.equal(s.intelligence.synthetic,true);
});
test('active-repository baseline sums four source platform records without adding publication samples',()=>{
 assert.equal(s.activeRepositories.value,Object.values(s.activeRepositories.platforms).reduce((a,b)=>a+b,0));
 assert.equal(s.activeRepositories.value,11439426);
 assert.match(s.activeRepositories.scope[1],/not cross-platform deduplicated/);
 assert.equal(Object.keys(s.activeRepositories.platforms).length,4);
});
test('four pulse counters refresh monotonically and never mutate snapshots',()=>{
 const before=JSON.stringify(s);let previous=m.dashboardPulse(s,m.DEMO_START);
 for(let n=1;n<=100;n++){const next=m.dashboardPulse(s,m.DEMO_START+n*m.REFRESH_MS);for(const k of m.dashboardMetricKeys){assert.ok(next[k].value>previous[k].value);assert.equal(next[k].delta,next[k].value-previous[k].value);assert.equal(next[k].base,previous[k].base);}previous=next;}
 assert.equal(JSON.stringify(s),before);
 assert.equal(m.dashboardPulse(s,0).developers.value,28903652);
 assert.equal(m.dashboardPulse(s,m.DEMO_START).intelligence.value,12840);
 const t=m.DEMO_START+3*m.REFRESH_MS;assert.deepEqual(m.dashboardPulse(s,t),m.dashboardPulse(s,t+m.REFRESH_MS-1));
});
test('Git scenario uses the captured calendar date and is explicitly a projection',()=>{
 assert.equal(s.gitScenario.status,'unverified-user-projection');
 const x=structuredClone(s);x.checkedAt='2026-01-01';assert.equal(m.gitScenarioBaseline(x),0);
 x.checkedAt='2027-01-01';assert.equal(m.gitScenarioBaseline(x),14000000000);
 x.checkedAt='2025-12-31';assert.equal(m.gitScenarioBaseline(x),0);
 assert.equal(m.gitScenarioBaseline(s),11430136986);
});
