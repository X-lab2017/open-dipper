export type Copy = {zh:string;en:string};
export type Kind = 'software'|'model'|'dataset';
export type Lens = 'software'|'assets';
export type Scenario = 'all'|'coding'|'research'|'local';
export type Ring = 'adopt'|'trial'|'assess';
export type Metric = {id:string;label:Copy;value:number|null;unit:Copy;period:string|null;sourceId:string;series?:{period:string;value:number|null}[]};
export type Entity = {id:string;kind:Kind;name:string;short:string;owner:string;category:number;scenarios:Exclude<Scenario,'all'>[];description:Copy;url:string;version:string|null;license:string|null;tags:Copy[];metrics:Metric[];sourceIds:string[]};
export type Source = {id:string;name:string;url:string;retrievedAt:string;observedAt:string|null;scope:Copy};
export type Catalog = {schemaVersion:1;assembledAt:string;sources:Source[];entities:Entity[]};
export type Assessment = {entityId:string;ring:Ring;why:Copy;fit:Copy;caution:Copy;steps:Copy[];change:Copy};
export type Demo = {schemaVersion:1;fixtureDate:string;provenance:'demo';assessments:Assessment[]};
export type RadarState = {lens:Lens;scenario:Scenario;view:'radar'|'list';query:string;categories:number[];ring:'all'|Ring;kind:'all'|Kind;selected:string;tabs:string[];compare:string[];watched:string[];demo:boolean;guideHidden:boolean;onlyWatched:boolean;paused:boolean;sector:number|null};
export const ringOrder:Ring[]=['adopt','trial','assess'];
export const ringNames:Record<Ring,Copy>={adopt:{zh:'采用参考',en:'Adoption reference'},trial:{zh:'建议试用',en:'Worth a trial'},assess:{zh:'持续观察',en:'Keep watching'}};
export const kindNames:Record<Kind,Copy>={software:{zh:'软件项目',en:'Software'},model:{zh:'模型版本',en:'Model'},dataset:{zh:'数据集',en:'Dataset'}};
export const categories:Record<Lens,Copy[]>={software:[{zh:'应用与工作流',en:'Apps & workflows'},{zh:'框架与协作',en:'Frameworks & orchestration'},{zh:'工具与运行时',en:'Tools & runtimes'},{zh:'模型工程与评测',en:'Model engineering & evaluation'}],assets:[{zh:'语言与推理',en:'Language & reasoning'},{zh:'多模态与具身',en:'Multimodal & embodied'},{zh:'检索与表示',en:'Retrieval & embeddings'},{zh:'数据与评测集',en:'Datasets & benchmarks'}]};
export const scenarios:Record<Scenario,{name:Copy;goal:Copy}>={
 all:{name:{zh:'开源 AI 全景',en:'Explore the AI landscape'},goal:{zh:'发现值得了解的软件、模型与数据，建立你的候选清单。',en:'Discover software, models and data worth exploring. Build your shortlist.'}},
 coding:{name:{zh:'改善编码工作流',en:'Improve a coding workflow'},goal:{zh:'从编码 Agent 到模型与评测，找到下一次试用的起点。',en:'Find a starting point for your next trial, from coding agents to models and evaluations.'}},
 research:{name:{zh:'构建知识 / 研究 Agent',en:'Build a research agent'},goal:{zh:'围绕检索、编排、工具与评测，逐步搭建可验证的研究流程。',en:'Explore retrieval, orchestration, tools and evaluation for a verifiable research workflow.'}},
 local:{name:{zh:'选择本地模型与数据',en:'Choose local models & data'},goal:{zh:'对照具体版本、许可与部署资料，明确需要验证的条件。',en:'Check versions, licenses and deployment resources to identify what you need to verify.'}}
};
const copyOK=(x:any):x is Copy=>!!x&&typeof x.zh==='string'&&typeof x.en==='string';
const dateOK=(x:any)=>typeof x==='string'&&Number.isFinite(Date.parse(x));
export const urlOK=(x:any):x is string=>typeof x==='string'&&/^https?:\/\//i.test(x)&&!/[\u0000-\u0020]/.test(x);
const idOK=(x:any)=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,179}$/.test(x);
export function validateCatalog(x:any):x is Catalog{
 if(!x||x.schemaVersion!==1||!dateOK(x.assembledAt)||!Array.isArray(x.sources)||!Array.isArray(x.entities)||x.entities.length>500||!x.entities.length)return false;
 if(x.sources.length>100||new Set(x.sources.map((s:any)=>s?.id)).size!==x.sources.length||!x.sources.every((s:any)=>s&&idOK(s.id)&&typeof s.name==='string'&&urlOK(s.url)&&dateOK(s.retrievedAt)&&(s.observedAt===null||dateOK(s.observedAt))&&copyOK(s.scope)))return false;
 const sourceIds=new Set(x.sources.map((s:Source)=>s.id));
 return new Set(x.entities.map((e:any)=>e?.id)).size===x.entities.length&&x.entities.every((e:any)=>e&&idOK(e.id)&&['software','model','dataset'].includes(e.kind)&&[e.name,e.short,e.owner].every(v=>typeof v==='string'&&v.length>0&&v.length<300)&&Number.isInteger(e.category)&&e.category>=0&&e.category<4&&(e.kind!=='dataset'||e.category===3)&&Array.isArray(e.scenarios)&&e.scenarios.every((s:any)=>['coding','research','local'].includes(s))&&copyOK(e.description)&&urlOK(e.url)&&(e.version===null||typeof e.version==='string')&&(e.license===null||typeof e.license==='string')&&Array.isArray(e.tags)&&e.tags.every(copyOK)&&Array.isArray(e.sourceIds)&&e.sourceIds.length>0&&e.sourceIds.every((s:any)=>sourceIds.has(s))&&Array.isArray(e.metrics)&&e.metrics.every((m:any)=>m&&idOK(m.id)&&copyOK(m.label)&&copyOK(m.unit)&&(m.value===null||Number.isFinite(m.value)&&m.value>=0)&&(m.period===null||typeof m.period==='string')&&sourceIds.has(m.sourceId)&&(!m.series||Array.isArray(m.series)&&m.series.length<=60&&m.series.every((p:any)=>p&&typeof p.period==='string'&&(p.value===null||Number.isFinite(p.value)&&p.value>=0)))));
}
export function validateDemo(x:any,catalog:Catalog):x is Demo{
 const ids=new Set(catalog.entities.map(e=>e.id));
 return !!x&&x.schemaVersion===1&&x.provenance==='demo'&&dateOK(x.fixtureDate)&&Array.isArray(x.assessments)&&x.assessments.length<=500&&new Set(x.assessments.map((a:any)=>a?.entityId)).size===x.assessments.length&&x.assessments.every((a:any)=>a&&ids.has(a.entityId)&&ringOrder.includes(a.ring)&&[a.why,a.fit,a.caution,a.change].every(copyOK)&&Array.isArray(a.steps)&&a.steps.length>0&&a.steps.length<=6&&a.steps.every(copyOK));
}
export function freshState(raw?:unknown):RadarState{
 const x=raw&&typeof raw==='object'?raw as any:{};
 return {lens:x.lens==='assets'?'assets':'software',scenario:Object.hasOwn(scenarios,x.scenario??'')?x.scenario:'all',view:x.view==='list'?'list':'radar',query:'',categories:[0,1,2,3],ring:'all',kind:'all',selected:typeof x.selected==='string'?x.selected:'',tabs:[],compare:[],watched:Array.isArray(x.watched)?[...new Set(x.watched.filter(idOK))].slice(0,200) as string[]:[],demo:x.demo!==false,guideHidden:x.guideHidden===true,onlyWatched:false,paused:x.paused===true,sector:null};
}
export function filteredEntities(catalog:Catalog,state:RadarState,demo:Demo|null):Entity[]{
 const q=state.query.trim().toLocaleLowerCase();
 return catalog.entities.filter(e=>(state.lens==='software'?e.kind==='software':e.kind!=='software')&&state.categories.includes(e.category)&&(state.scenario==='all'||e.scenarios.includes(state.scenario))&&(state.kind==='all'||e.kind===state.kind)&&(!state.onlyWatched||state.watched.includes(e.id))&&(state.ring==='all'||state.demo&&demo?.assessments.some(a=>a.entityId===e.id&&a.ring===state.ring))&&(!q||[e.name,e.owner,e.description.zh,e.description.en,...e.tags.flatMap(t=>[t.zh,t.en])].join(' ').toLocaleLowerCase().includes(q)));
}
export function visibleAssessment(entityId:string,state:RadarState,demo:Demo|null):Assessment|null{return state.demo?demo?.assessments.find(a=>a.entityId===entityId)??null:null;}
export function toggleCompare(ids:string[],id:string,catalog:Catalog):{ids:string[];error:'mixed'|'limit'|null}{
 if(ids.includes(id))return {ids:ids.filter(x=>x!==id),error:null};
 const entity=catalog.entities.find(e=>e.id===id);if(!entity)return {ids,error:null};
 const old=ids.filter(x=>catalog.entities.some(e=>e.id===x));
 if(old.some(x=>catalog.entities.find(e=>e.id===x)!.kind!==entity.kind))return {ids:old,error:'mixed'};
 if(old.length>=3)return {ids:old,error:'limit'};
 return {ids:[...old,id],error:null};
}
export function monthlyChange(metric:Metric):number|null{
 const s=metric.series;if(!s||s.length<2)return null;const a=s.at(-2)!,b=s.at(-1)!;
 if(!/^\d{4}-\d{2}$/.test(a.period)||!/^\d{4}-\d{2}$/.test(b.period)||a.value==null||b.value==null||a.value<=0)return null;
 const month=(p:string)=>Number(p.slice(0,4))*12+Number(p.slice(5));if(month(b.period)-month(a.period)!==1)return null;
 return (b.value/a.value-1)*100;
}
// Numbering is an edition index, not a ranking. Filters never renumber targets.
export function radarNumbers(catalog:Catalog,lens:Lens):Map<string,number>{
 const entries=catalog.entities.filter(e=>lens==='software'?e.kind==='software':e.kind!=='software');
 return new Map(entries.map((e,i)=>[e.id,i+1]));
}
// Hexagonal slots preserve equal target size and minimum separation within each band.
// Positions derive from the complete edition, never from filtered candidates.
export function radarPositions(catalog:Catalog,demo:Demo,lens:Lens):Map<string,{x:number;y:number;angle:number}>{
 const positions=new Map<string,{x:number;y:number;angle:number}>(),bands={adopt:[50,129],trial:[152,215],assess:[241,299]};
 for(let category=0;category<4;category++)for(const ring of ringOrder){
  const entries=catalog.entities.filter(e=>(lens==='software'?e.kind==='software':e.kind!=='software')&&e.category===category&&demo.assessments.some(a=>a.entityId===e.id&&a.ring===ring));
  const [lo,hi]=bands[ring],slots:{x:number;y:number}[]=[];
  for(let row=0;row<13;row++)for(let col=0;col<13;col++){
   const x=20+col*28+(row%2?14:0),y=20+row*28*Math.sqrt(3)/2,r=Math.hypot(x,y);
   if(r>=lo&&r<=hi)slots.push({x,y});
  }
  const used:{x:number;y:number}[]=[];
  entries.forEach((e,i)=>{
   // Farthest-slot sampling fills the whole band instead of forming a thin arc.
   let best=0,bestDistance=-1;for(let j=0;j<slots.length;j++){
    const p=slots[j],distance=used.length?Math.min(...used.map(q=>Math.hypot(p.x-q.x,p.y-q.y))):1000-Math.abs(Math.atan2(p.y,p.x)-Math.PI/4)*100-Math.abs(Math.hypot(p.x,p.y)-(lo+hi)/2);
    if(distance>bestDistance){best=j;bestDistance=distance;}
   }
   const p=slots.splice(best,1)[0];if(!p)throw new Error(`Radar band capacity exceeded: ${lens}/${category}/${ring}`);used.push(p);
   const dx=category===0||category===2?-p.x:p.x,dy=category<2?-p.y:p.y;
   positions.set(e.id,{x:340+dx,y:340+dy,angle:Math.atan2(dy,dx)*180/Math.PI});
  });
 }
 return positions;
}
export function exportRadar(catalog:Catalog,entities:Entity[],state:RadarState,demo:Demo|null,lang:'zh'|'en'):string{
 const t=(zh:string,en:string)=>lang==='zh'?zh:en;
 const md=(s:string)=>s.replace(/[\r\n]+/g,' ').replace(/([\\`*_{}\[\]<>])/g,'\\$1');
 return `# OpenDipper · ${t('AI 雷达候选清单','AI radar shortlist')}\n\n${t('事实来源与模拟建议分开；不是独立评测或生产采用结论。关注仅保存在本机，尚未开通提醒投递。','Source facts and simulated advice are separate; this is not an independent evaluation or production recommendation. Watches are local; alerts are not delivered.')}\n\n`+entities.map(e=>{
  const a=visibleAssessment(e.id,state,demo);
  return `## ${md(e.name)}\n\n${md(e.description[lang])}\n\n${e.url}\n\n${t('版本','Version')}: ${md(e.version??t('未锁定','Not pinned'))}\n${t('许可元数据','License metadata')}: ${md(e.license??t('待核验','Unverified'))}\n\n`+e.metrics.map(m=>`- ${md(m.label[lang])}: ${m.value??'—'} ${md(m.unit[lang])} · ${md(m.period??t('窗口未披露','Window unspecified'))}`).join('\n')+`\n\n${a?`**${t('模拟建议','SIMULATED ADVICE')} · ${ringNames[a.ring][lang]} · ${demo!.fixtureDate}**\n\n${md(a.why[lang])}\n\n${md(a.caution[lang])}\n\n${a.steps.map((s,i)=>`${i+1}. ${md(s[lang])}`).join('\n')}`:t('采用建议：待评审。','Adoption assessment: pending review.')}\n\n${t('来源','Sources')}:\n${e.sourceIds.map(id=>catalog.sources.find(s=>s.id===id)!).map(s=>`- ${md(s.name)}: ${s.url} (${s.observedAt??t('观察期未声明','Observation period unspecified')})`).join('\n')}\n`;
 }).join('\n---\n\n');
}
