import type {Category,Country,Lang} from './model';
export type ObjectId='developer'|'organization'|'project'|'model'|'dataset'|'facility';
export type Viewpoint='global'|'developer'|'enterprise'|'researcher'|'policy'|'foundation'|'custom';
export type LayerId='developers'|'contribution'|'influence'|'community'|'organizations'|'models'|'datasets'|'facilities'|'demo';
export const objects:Record<ObjectId,[string,string]>={developer:['开发者','Developers'],organization:['组织','Organizations'],project:['代码项目','Code projects'],model:['模型','Models'],dataset:['数据集','Datasets'],facility:['基础设施','Infrastructure']};
export const objectLayers:Record<ObjectId,LayerId[]>={developer:['developers','contribution'],organization:['community','organizations'],project:['influence'],model:['models'],dataset:['datasets'],facility:['facilities']};
export const layerObject:Record<LayerId,ObjectId>={developers:'developer',contribution:'developer',influence:'project',community:'organization',organizations:'organization',models:'model',datasets:'dataset',facilities:'facility',demo:'developer'};
export const layerNames:Record<LayerId,[string,string]>={developers:['开发者规模','Developer stock'],contribution:['开发者贡献 · OpenRank','Developer contribution · OpenRank'],influence:['项目影响力 · OpenRank','Project influence · OpenRank'],community:['组织关联社区','Associated community'],organizations:['机构位置','Organization locations'],models:['模型发布组织样本','Model publisher sample'],datasets:['数据集发布组织样本','Dataset publisher sample'],facilities:['数据中心设施','Data center facilities'],demo:['模拟地域指标','Simulated metrics']};
export const viewpoints:Record<Exclude<Viewpoint,'custom'>,{name:[string,string];layer:LayerId;categories:Category[];organization:number;highlights:string[];description:[string,string]}>= {
 global:{name:['全球总览','Global overview'],layer:'developers',categories:[],organization:0,highlights:['developers','regions'],description:['参与规模 × 全部动态','Participation × all signals']},
 developer:{name:['开发者视角','For developers'],layer:'contribution',categories:['release','community','security'],organization:0,highlights:['repositories','events'],description:['协作贡献 × 发布、安全与社区','Contribution × releases, security & community']},
 enterprise:{name:['企业视角','For enterprises'],layer:'influence',categories:['release','security','research'],organization:0,highlights:['organizations','repositories'],description:['项目影响 × 技术、安全与研究','Project influence × technology, security & research']},
 researcher:{name:['研究者视角','For researchers'],layer:'models',categories:['research','release'],organization:0,highlights:['models','datasets'],description:['模型供给 × 研究与发布','Model supply × research & releases']},
 policy:{name:['政策制定者视角','For policymakers'],layer:'developers',categories:['policy','foundation','research'],organization:0,highlights:['regions','organizations'],description:['参与分布 × 政策、治理与研究','Participation × policy, governance & research']},
 foundation:{name:['基金会视角','For foundations'],layer:'community',categories:['foundation','community','security'],organization:1,highlights:['organizations','events'],description:['关联社区 × 治理、协作与安全','Community × governance, collaboration & security']},
};
export function parseViewpoint(x:unknown):Viewpoint{return typeof x==='string'&&(x==='custom'||Object.hasOwn(viewpoints,x))?x as Viewpoint:'global';}
export type PublisherRow={code:string;rawCode:string|null;name:string;nameZh:string;value:number|null;downloads:number|null;organizations:number;longitude:number|null;latitude:number|null};
type RepoSource={repository:string;commit:string;url:string};
export type Observation={schemaVersion:1;organizations:{total:number;groups:Record<'company'|'research'|'foundation'|'community'|'public',number>;source:RepoSource;manifestSha256:string};repositories:{count:number;byPlatform:Record<string,number>;source:RepoSource};publisher:{source:RepoSource&{path:string;gitBlobSha:string};retrievedAt:string;maps:Record<'models'|'datasets',{rows:PublisherRow[];total:number;organizations:number;observedPeriod:null}>};facilities:{status:'not_connected';count:null}};
const count=(v:unknown)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
const http=(v:unknown)=>{try{return typeof v==='string'&&['https:','http:'].includes(new URL(v).protocol);}catch{return false;}};
const source=(v:any)=>typeof v?.repository==='string'&&/^[a-f0-9]{40}$/.test(v.commit)&&http(v.url);
export function validateObservation(x:any):x is Observation{try{
 if(x?.schemaVersion!==1||!count(x.organizations.total)||!source(x.organizations.source)||!/^[a-f0-9]{64}$/.test(x.organizations.manifestSha256))return false;
 const keys=['company','research','foundation','community','public'];if(Object.keys(x.organizations.groups).length!==keys.length||!keys.every(k=>count(x.organizations.groups[k]))||keys.reduce((n,k)=>n+x.organizations.groups[k],0)!==x.organizations.total)return false;
 if(!count(x.repositories.count)||!source(x.repositories.source)||!Object.values(x.repositories.byPlatform).every(count)||Object.values(x.repositories.byPlatform).reduce((n:any,v:any)=>n+v,0)!==x.repositories.count)return false;
 if(!source(x.publisher.source)||!/^[a-f0-9]{40}$/.test(x.publisher.source.gitBlobSha)||!Number.isFinite(Date.parse(x.publisher.retrievedAt)))return false;
 for(const k of ['models','datasets']){const m=x.publisher.maps[k];if(!Array.isArray(m.rows)||m.rows.length>300||!count(m.total)||!count(m.organizations)||m.observedPeriod!==null)return false;const seen=new Set();for(const r of m.rows){
  if(!/^[A-Z]{2}$/.test(r.code)||seen.has(r.code)||!(r.rawCode===null||/^[A-Z]{3}$/.test(r.rawCode))||typeof r.name!=='string'||typeof r.nameZh!=='string'||!count(r.organizations)||!(r.value===null||count(r.value))||!(r.downloads===null||count(r.downloads)))return false;
  if((r.organizations===0)!==(r.value===null)||((r.value===null)!==(r.downloads===null)))return false;
  if(!((r.longitude===null&&r.latitude===null)||(Number.isFinite(r.longitude)&&Math.abs(r.longitude)<=180&&Number.isFinite(r.latitude)&&Math.abs(r.latitude)<=90)))return false;seen.add(r.code);
 }if(m.rows.reduce((n:number,r:PublisherRow)=>n+(r.value??0),0)!==m.total)return false;}
 return x.facilities.status==='not_connected'&&x.facilities.count===null;
 }catch{return false;}}
export async function loadObservation(base:string):Promise<Observation|null>{try{const r=await fetch(`${base}data/observation.json`,{cache:'no-cache'});if(!r.ok)return null;const x=await r.json();return validateObservation(x)?x:null;}catch{return null;}}
export function publisherCountries(x:Observation,key:'models'|'datasets',metric:'value'|'downloads'):Country[]{return x.publisher.maps[key].rows.map(r=>({country:r.code==='TW'?'Taiwan, China':r.name,countryZh:r.code==='TW'?'中国台湾':r.nameZh,rawCode:r.rawCode??`unmapped:${r.code}`,sourceCode:r.code,longitude:r.longitude,latitude:r.latitude,...(r[metric]===null?{}:{atlasValue:r[metric]!})}));}
export function coverageRegions(maps:{rows:{code:string}[]}[]){return new Set(maps.flatMap(m=>m.rows.map(r=>r.code))).size;}
