export type Copy=[string,string];
export type Material={id:string;kind:'data'|'news'|'paper'|'community';provenance:'snapshot'|'source'|'demo';date:string;captured:string;title:Copy;summary:Copy;source:string;url:string;objects:string[];period?:Copy;value?:string;series?:number[];page?:'overview'|'radar'|'ecosystem'};
export const fixtureDate='2026-10-27';
export const demoMaterials:Material[]=[
 ['aurora-release','2026-10-27','news','Aurora','批处理接口更新，迁移成本值得重新评估','Batching API changes: reconsider migration costs','发布说明提到新接口；性能收益仍需独立验证。','The release describes a new API; benefits need independent verification.'],
 ['nova-paper','2026-10-25','paper','Nova Runtime','相同硬件下，吞吐与延迟可能走向不同方向','Throughput and latency may diverge on the same hardware','论文样例提出对比实验；摘要不能替代可复现结果。','A fictional paper proposes a comparison; an abstract is not a reproduced result.'],
 ['aurora-data','2026-10-24','data','Aurora','贡献人数增长，维护压力也在上升？','More contributors, but more maintenance pressure?','模拟月度样本显示增长；增长与维护负担的因果关系尚未成立。','Illustrative monthly growth does not establish a causal maintenance burden.'],
 ['polaris-call','2026-10-22','community','Polaris','一个小型贡献任务，连接两条工具链','One contribution task connects two toolchains','社区样例开放适配器任务；可以从一个有限范围的贡献开始。','A fictional adapter task offers a bounded starting point for contribution.'],
 ['harbor-note','2026-10-20','news','Harbor','维护交接公告之后，还需要确认哪些信息？','What remains uncertain after a maintainer handover notice?','公告样例缺少交接完成确认，不应据此判断项目停更。','This example lacks handover confirmation; do not infer abandonment.'],
 ['nova-data','2026-10-18','data','Nova Runtime','增长曲线背后，哪些参与者留下来了？','Who stays behind a growing activity curve?','模拟趋势用于演示观察视角，不能据此识别真实个人或贡献质量。','Illustrative trends cannot identify real people or contribution quality.'],
 ['aurora-benchmark','2026-10-15','paper','Aurora','一份独立复现实验补充了适用条件','An independent replication adds conditions','虚构实验提示收益依赖批量大小；并非所有场景都适用。','A fictional replication suggests gains depend on batch size.'],
 ['polaris-graph','2026-10-12','data','Polaris','共享贡献者，是否意味着新的生态邻居？','Do shared contributors reveal new ecosystem neighbors?','模拟关系只代表协作线索，不代表合作承诺、依赖或模型派生。','Illustrative connections are not partnerships, dependencies or model lineage.'],
 ['aurora-initial','2026-10-08','news','Aurora','推理工具发布：值得试用，但先留下问题','An inference release worth trying—with open questions','只有作者发布材料，缺少同口径实验与迁移反馈。','Only fictional author material is available; comparable trials are missing.'],
 ['harbor-forum','2026-10-05','community','Harbor','讨论中的需求，能否成为下一次研究起点？','Could a community question spark the next investigation?','社区样例讨论兼容性约束；意见不等于已验证事实。','A fictional compatibility discussion provides leads, not verified facts.']
].map(([id,date,kind,obj,zh,en,sz,se])=>({id,kind:kind as Material['kind'],provenance:'demo',date,captured:date,title:[zh,en],summary:[sz,se],source:'PRODUCT LAB',url:'',objects:[obj],...(kind==='data'?{series:id==='nova-data'?[18,22,21,28,32,35]:[12,15,23,19,31,42],period:['模拟月度序列 · 2026.05–10','Illustrative monthly series · May–Oct 2026'] as Copy,value:id==='polaris-graph'?'3 ↔ 5':'+38%'}:{})}));
export type Research={id:string;question:string;materialIds:string[];from:number;to:number;tracked:boolean;revision:number};
export type RoomState={version:2;tab:'signals'|'research'|'tracking';from:number;to:number;mode:'range'|'asof';kind:string;query:string;demo:boolean;selected:string[];draft:string;researches:Research[];active:string;format:'brief'|'table'|'chart';cadence:'weekly'|'changes';showDiff:boolean};
export function normalizeRoom(x:unknown):RoomState{
 const v=x&&typeof x==='object'?x as Record<string,unknown>:{};
 const day=(n:unknown,d:number)=>typeof n==='number'&&Number.isInteger(n)?Math.max(1,Math.min(27,n)):d;
 const from=day(v.from,1),to=Math.max(from,day(v.to,27));
 const ids=(a:unknown)=>Array.isArray(a)?[...new Set(a.filter((i):i is string=>typeof i==='string'&&/^[\w:.-]{1,160}$/.test(i)))].slice(0,30):[];
 const researches:Research[]=Array.isArray(v.researches)?v.researches.filter((r:any)=>r&&typeof r.id==='string'&&/^[\w-]{1,80}$/.test(r.id)&&typeof r.question==='string').slice(0,12).map((r:any)=>({id:r.id,question:r.question.slice(0,600),materialIds:ids(r.materialIds),from:day(r.from,1),to:Math.max(day(r.from,1),day(r.to,27)),tracked:r.tracked===true,revision:day(r.revision,1)>3?3:day(r.revision,1)})):[];
 return {version:2,tab:v.tab==='research'||v.tab==='tracking'?v.tab:'signals',from,to,mode:v.mode==='asof'?'asof':'range',kind:['data','news','paper','community'].includes(String(v.kind))?String(v.kind):'all',query:typeof v.query==='string'?v.query.slice(0,120):'',demo:v.demo!==false,selected:ids(v.selected),draft:typeof v.draft==='string'?v.draft.slice(0,600):'',researches,active:typeof v.active==='string'&&researches.some(r=>r.id===v.active)?v.active:researches[0]?.id||'',format:v.format==='table'||v.format==='chart'?v.format:'brief',cadence:v.cadence==='changes'?'changes':'weekly',showDiff:v.showDiff===true};
}
export const dateOf=(day:number)=>`2026-10-${String(day).padStart(2,'0')}`;
export function filterMaterials(items:Material[],s:RoomState):Material[]{
 return items.filter(m=>{
  if(m.provenance==='demo'&&!s.demo)return false;
  if(s.kind!=='all'&&m.kind!==s.kind)return false;
  if(s.query&&!`${m.title.join(' ')} ${m.summary.join(' ')} ${m.objects.join(' ')} ${m.source}`.toLowerCase().includes(s.query.toLowerCase()))return false;
  if(s.mode==='asof')return m.captured.slice(0,10)<=dateOf(s.to)&&m.date.slice(0,10)<=dateOf(s.to);
  return m.kind==='data'?m.captured.slice(0,10)<=dateOf(s.to):m.date.slice(0,10)>=dateOf(s.from)&&m.date.slice(0,10)<=dateOf(s.to);
 }).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export const revisions:{date:string;title:Copy;change:Copy;action:Copy;source:string;values:number[]}[]=[
 {date:'2026-10-08',title:['先试用，不做性能排名','Trial first; no performance ranking'],change:['只有作者发布材料，性能结论待独立复现。','Only author material exists; performance awaits replication.'],action:['固定硬件与工作负载，设计小规模验证。','Fix hardware and workload; scope a small trial.'],source:'aurora-initial',values:[12,15,23]},
 {date:'2026-10-15',title:['增加适用条件，保留试用建议','Add conditions; keep the trial recommendation'],change:['新增虚构复现实验：收益依赖批量大小；修改适用条件。','Fictional replication adds a batch-size constraint; applicability changes.'],action:['将低延迟与高吞吐场景分开比较。','Compare latency-sensitive and throughput-oriented workloads separately.'],source:'aurora-benchmark',values:[12,15,23,19]},
 {date:'2026-10-27',title:['接口已变化，迁移建议需要更新','API changes require a revised migration plan'],change:['新增虚构接口说明：此前适配步骤需要复查；性能判断未因此提升。','A fictional API update requires adapter review; it does not improve the performance judgment.'],action:['更新适配器检查清单，再决定是否扩大试用。','Update the adapter checklist before expanding the trial.'],source:'aurora-release',values:[12,15,23,19,31,42]}
];
export function roomExport(s:RoomState,items:Material[],english:boolean):string{
 const r=s.researches.find(r=>r.id===s.active);const i=english?1:0;
 const selected=r?r.materialIds:s.selected;
 return [`# ${english?'Agent Room · research draft':'Agent 情报室 · 研究草案'}`,'PRODUCT PROTOTYPE / DEMO — no live Agent or automatic delivery',`## ${english?'Your question (not executed)':'你的问题（未执行）'}`,r?.question||s.draft||'—',`## ${english?'Selected interval':'选定时间范围'}`,`${dateOf(r?.from||s.from)} — ${dateOf(r?.to||s.to)}`,`## ${english?'Selected sources':'所选资料'}`,...selected.map(id=>{const m=items.find(m=>m.id===id);return m?`- [${m.provenance.toUpperCase()}] ${m.title[i]}\n  ${m.date} / captured ${m.captured}\n  ${m.period?.[i]||''}\n  ${m.url||'DEMO: no factual source URL'}`:`- ${id}: unavailable; not silently substituted`;}),`## ${english?'Independent fictional example—not an answer to your question':'独立虚构成果样例——不是对自定义问题的回答'}`,...revisions.slice(0,r?.revision||1).map(v=>`${v.date}: ${v.title[i]}\n${v.change[i]}\n${v.action[i]}`)].join('\n\n');
}
