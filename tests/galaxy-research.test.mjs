import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {JSDOM} from 'jsdom';
const urls={};
for(const name of ['model','discovery','report']){
 let js=ts.transpileModule(await fs.readFile(`src/galaxy/${name}.ts`,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 for(const [key,url] of Object.entries(urls))js=js.replaceAll(`'./${key}'`,JSON.stringify(url));
 urls[name]='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
}
const [m,d,r]=await Promise.all(['model','discovery','report'].map(key=>import(urls[key])));
const read=async path=>JSON.parse(await fs.readFile(`public/data/${path}.json`,'utf8'));
const [code,model,catalog,snapshot,eventData]=await Promise.all(['galaxy/code','galaxy/model','radar-catalog','snapshot','events'].map(read));
const index=m.buildIndex({code,model}),ids=index.nodes.map((_,i)=>i),id=url=>m.findByUrl(index,url);
const c={catalog,repositories:snapshot.repositories,events:eventData.events,lang:'zh'},at='2026-10-26T12:00:00.000Z';
const pytorch=id('https://github.com/pytorch/pytorch'),vllm=id('https://github.com/vllm-project/vllm'),bge=id('https://huggingface.co/BAAI/bge-m3');
test('discovery matches tasks, topics, Chinese aliases and languages without short-word false positives',()=>{
 assert.equal(d.discover(index,ids,'all','pytorch','relevance')[0],pytorch);
 assert.ok(m.queryScore(index.nodes[pytorch],'Python')>0);
 assert.equal(m.queryScore({...index.nodes[pytorch],name:'tools/storage',topics:[],description:'Storage manager',category:'Database',language:'Go',author:''},'rag'),0);
 assert.ok(m.queryScore(index.nodes[bge],'检索')>0);
 assert.equal(d.discover(index,ids,'all','https://github.com/pytorch/pytorch/','relevance')[0],pytorch);
 for(const [task,url] of [['agents','https://github.com/langchain-ai/langgraph'],['retrieval','https://huggingface.co/BAAI/bge-m3'],['inference','https://github.com/vllm-project/vllm'],['data','https://huggingface.co/datasets/HuggingFaceFW/fineweb']])assert.ok(d.discover(index,ids,task,'','relevance').includes(id(url)));
 assert.ok(!d.taskMatch({...index.nodes[pytorch],name:'org/monitoring-agent',topics:['monitoring'],category:'Development Tools',description:'System monitoring agent'},'agents').matched);
 assert.ok(!d.taskMatch(index.nodes[id('https://github.com/colinhacks/zod')],'inference').matched);
 assert.ok(d.discover(index,ids,'inference','','relevance').every(i=>index.nodes[i].source==='code'));
});
test('recorded degree is recomputed, peer candidates keep type, and shortlist stays bounded',()=>{
 assert.equal(d.recordedDegrees(index)[bge],26);assert.equal(index.nodes[bge].degree,27);
 assert.ok(d.sameDomainPeers(index,bge).every(p=>p.node.kind==='model'&&p.node.source==='model'&&p.node.category===index.nodes[bge].category));
 let keys=[];for(const i of [pytorch,vllm,bge])keys=d.shortlistToggle(keys,index.nodes[i].key,index).keys;
 assert.equal(d.shortlistToggle(keys,index.nodes[0].key,index).limited,true);
 assert.equal(d.shortlistToggle(keys,index.nodes[bge].key,index).keys.length,2);
 assert.equal(d.shortlistToggle(keys,'unknown:key',index).keys.length,3);
 assert.equal(r.comparisonFacts(index,[pytorch,bge]).sameType,false);
 assert.equal(r.comparisonFacts(index,[pytorch,vllm]).sameType,true);
});
test('connection paths never fabricate cross-network or inferred links',()=>{
 const path=d.findRecordedPath(index,pytorch,vllm);assert.equal(path.status,'found');assert.ok(path.edges.length<=3);assert.ok(path.edges.every(i=>!index.edges[i].inferred));
 assert.equal(d.findRecordedPath(index,pytorch,bge).status,'different-networks');
 const tiny={nodes:[{source:'model'},{source:'model'},{source:'model'}],edges:[{source:0,target:1,inferred:true},{source:1,target:2,inferred:false}],neighbors:new Map([[0,[0]],[1,[0,1]],[2,[1]]])};
 assert.equal(d.findRecordedPath(tiny,0,2).status,'not-found');
});
test('reports retain observation clocks, dated facts and missing evidence without demo assessments',()=>{
 const report=r.buildProjectReport(index,pytorch,c,at);
 assert.equal(report.observation,'2025.08—2026.07');assert.equal(report.generatedAt,at);assert.ok(report.series.points.length>1);assert.equal(report.license,null);assert.equal(r.buildProjectReport(index,vllm,c,at).license.value,'Apache-2.0');
 assert.ok(report.metrics.some(x=>x.label.includes('12 个月')));assert.ok(new Set(report.metrics.map(x=>x.period)).size>1);
 assert.ok(report.sources.some(x=>x.commit===code.meta.sourceCommit));assert.ok(report.checks.some(x=>x.label==='任务表现与成本'&&x.status==='missing'));
 assert.equal(report.network.recordedNeighbors,d.recordedDegrees(index)[pytorch]);
 const sparse=r.buildProjectReport(index,bge,{repositories:[],lang:'zh'},at);assert.match(r.buildProjectReport(index,bge,c,at).license.source,/huggingface.co\/api\/models/);assert.equal(sparse.series,null);assert.equal(sparse.license,null);assert.ok(sparse.checks.filter(x=>x.status==='missing').length>=4);
 assert.equal(sparse.network.inferredNeighbors,1);assert.ok(sparse.network.neighbors.every(n=>!n.relation.includes('推断')));
 const withDemo={...c,catalog:{...catalog,assessments:[{entityId:report.entity.key,rating:'adopt',message:'FAKE_DEMO_VERDICT'}]},events:[{repository:'pytorch/pytorch',provenance:'demo',title:'FAKE_DEMO_VERDICT',occurredAt:at}]};
 assert.ok(!JSON.stringify(r.buildProjectReport(index,pytorch,withDemo,at)).includes('FAKE_DEMO_VERDICT'));
});
test('canonical URLs prevent model/Space collisions and inapplicable Space downloads stay absent',()=>{
 const space=index.nodes.findIndex(n=>n.kind==='space'&&n.name==='black-forest-labs/FLUX.1-dev'),modelId=id('https://huggingface.co/black-forest-labs/FLUX.1-dev');assert.ok(space>=0);assert.ok(modelId>=0);
 const injected={...c,catalog:{...catalog,entities:[{...catalog.entities[0],url:index.nodes[modelId].url,license:'MODEL_ONLY_LICENSE'}]}};
 const sr=r.buildProjectReport(index,space,injected,at);assert.equal(sr.license,null);assert.ok(!sr.metrics.some(x=>x.label.includes('下载')));assert.equal(sr.cohort.metric,'快照点赞');
 assert.equal(r.buildProjectReport(index,modelId,injected,at).license.value,'MODEL_ONLY_LICENSE');
});
test('reports are deterministic from evidence, self-contained and safe in HTML/Markdown exports',()=>{
 const report=r.buildProjectReport(index,pytorch,c,at);assert.deepEqual(report,r.buildProjectReport(index,pytorch,c,at));
 const hostile=structuredClone(report);hostile.entity.name='<img src=x onerror=alert(1)>';hostile.entity.description='<script>alert(1)</script> &bad;';hostile.entity.url='javascript:alert(1)';hostile.summary='<svg onload=alert(1)>';hostile.license={value:'<iframe src=x>',source:'https://example.org',period:'2026-10'};
 const exported=r.reportHTML(hostile),doc=new JSDOM(exported).window.document;
 assert.equal(doc.querySelectorAll('script,iframe,img,link[rel=stylesheet],a[href^="javascript:"]').length,0);assert.equal(doc.querySelector('h1').textContent,hostile.entity.name);
 assert.ok(exported.includes('window.print()'));assert.ok(exported.includes('<style>'));
 const markdown=r.reportMarkdown(hostile);assert.ok(!/<script|<img|<svg|<iframe|javascript:/.test(markdown));assert.ok(markdown.includes('&lt;script&gt;'));assert.ok(markdown.includes(code.meta.sourceCommit));
 assert.ok(JSON.parse(JSON.stringify(report)).metrics.every(x=>x.period&&x.source));
});
