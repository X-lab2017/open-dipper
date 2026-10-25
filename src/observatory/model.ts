export type Lang = 'zh' | 'en';
export type Metric = 'openrank' | 'activity' | 'change_requests_accepted' | 'participants' | 'contributors' | 'stars';
export type Category = 'release' | 'security' | 'foundation' | 'policy' | 'community' | 'research';
export type Event = {id:string; title:string; titleEn?:string; summary:string; summaryEn?:string; category:Category; severity:'info'|'important'|'critical'; occurredAt:string; collectedAt:string; source:string; sourceUrl:string; repository?:string; provenance:'automatic'|'manual'|'demo'; location:null|{name:string;nameEn?:string;lon:number;lat:number;countryCode:string;precision:string}; reviewStatus:'source-published'|'reviewed'|'demo'; tags:string[]};
export type Source = {id:string;name:string;kind:string;status:string;lastAttempt:string;lastSuccess:string|null;count:number;url:string;error?:string};
export type Feed = {schemaVersion:number;generatedAt:string;events:Event[];sources:Source[]};
export type Country = {country:string;countryZh?:string;displayRegionName?:string;rawCode:string;longitude:number|null;latitude:number|null;developers?:number;openrank?:number;atlasValue?:number;sourceCode?:string;activity?:number;change_requests_accepted?:number};
export type Layer = {id:string;name:string;nameZh:string;metaUpdatedAt:string;countries:Country[];provenance:{url:string;fetchedAt:string;sha256:string}};
export type Series = {status:string;latestMonth:string|null;points:{month:string;value:number}[];provenance:{url:string;fetchedAt:string;sha256:string}};
export type Repo = {key:string;platform:string;path:string;category:string;metrics:Record<string,Series>};
export type Snapshot = {fetchedAt:string;repositories:Repo[];metrics:{id:string;label:string;definition:string}[]};
export type Data = {snapshot:Snapshot;geography:{fetchedAt:string;layers:Layer[]};features:any[];feed:Feed;demo:{generatedAt:string;events:Event[];countries:Country[]};feedError?:boolean};
export const categories:Record<Category,{zh:string;en:string;color:string;icon:string}> = {
 release:{zh:'版本发布',en:'Releases',color:'var(--od-event-release)',icon:'◈'},security:{zh:'安全与供应链',en:'Security',color:'var(--od-event-security)',icon:'△'},
 foundation:{zh:'基金会与治理',en:'Governance',color:'var(--od-event-foundation)',icon:'◇'},policy:{zh:'政策与公共',en:'Policy',color:'var(--od-event-policy)',icon:'▤'},
 community:{zh:'社区与活动',en:'Community',color:'var(--od-event-community)',icon:'◎'},research:{zh:'研究与洞察',en:'Research',color:'var(--od-event-research)',icon:'⌁'}
};
export const metricNames:Record<Metric,[string,string]> = {openrank:['影响力 · OpenRank','Influence · OpenRank'],activity:['活跃度 · Activity','Activity'],change_requests_accepted:['贡献量 · 合并 PR','Contribution · Merged PRs'],participants:['参与者','Participants'],contributors:['贡献者','Contributors'],stars:['新增 Star','New stars']};
export const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const safeUrl=(s:string)=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}};
export const fmt=(n:number|undefined|null)=>n==null?'—':new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(n);
export const compact=(n:number|undefined|null)=>n==null?'—':n>=1e6?`${(n/1e6).toFixed(1)}m`:n>=1e3?`${(n/1e3).toFixed(1)}k`:fmt(n);
export function monthsUntil(month:string,n=24){const [y,m]=month.split('-').map(Number);return Array.from({length:n},(_,i)=>new Date(Date.UTC(y,m-n+i,1)).toISOString().slice(0,7));}
export function value(repo:Repo,metric:string,month:string){return repo.metrics[metric]?.points.find(p=>p.month===month)?.value;}
export function rank(repos:Repo[],platform:string,metric:string,month:string){return repos.filter(r=>r.platform===platform&&value(r,metric,month)!=null).sort((a,b)=>value(b,metric,month)!-value(a,metric,month)!);}
export function change(repo:Repo,metric:string,month:string){const prev=value(repo,metric,monthsUntil(month,2)[0]),curr=value(repo,metric,month);return prev==null||curr==null||prev===0?null:(curr-prev)/prev*100;}
export const regionCode=(code:string|undefined)=>({TW:'TWN','CN-TW':'TWN',CN:'CHN'}[code?.toUpperCase()??'']??code?.toUpperCase()??'');
export const regionGroup=(code:string|undefined)=>regionCode(code)==='TWN'?'CHN':regionCode(code);
export const regionMatches=(code:string|undefined,scope:string)=>regionCode(scope)==='CHN'?regionGroup(code)==='CHN':regionCode(code)===regionCode(scope);
export function locationName(location:{countryCode:string;name:string;nameEn?:string},lang:Lang){return regionCode(location.countryCode)==='TWN'?(lang==='zh'?'中国台湾':'Taiwan, China'):lang==='en'?location.nameEn??location.name:location.name;}
export function countryName(c:Country,lang:Lang){return regionCode(c.rawCode)==='TWN'||c.sourceCode==='TW'?(lang==='zh'?'中国台湾':'Taiwan, China'):lang==='zh'?c.displayRegionName??c.countryZh??c.country:c.country;}
export function filterEvents(events:Event[],f:{demo:boolean;category:string;query:string;days:number;region:string;severity:string},now=Date.now()){
 return events.filter(e=>(f.demo||e.provenance!=='demo')&&(f.category==='all'||e.category===f.category)&&(!f.region||regionMatches(e.location?.countryCode,f.region))&&(f.severity==='all'||e.severity===f.severity)&&(!f.days||(Date.parse(e.occurredAt)<=now&&Date.parse(e.occurredAt)>=now-f.days*864e5))&&`${e.title} ${e.titleEn??''} ${e.summary} ${e.repository??''} ${e.tags.join(' ')}`.toLowerCase().includes(f.query.toLowerCase())).sort((a,b)=>Date.parse(b.occurredAt)-Date.parse(a.occurredAt));
}
export function validateEvent(e:any):e is Event {return !!(e&&typeof e.id==='string'&&typeof e.title==='string'&&typeof e.summary==='string'&&Array.isArray(e.tags)&&e.tags.every((t:unknown)=>typeof t==='string')&&typeof e.source==='string'&&typeof e.sourceUrl==='string'&&categories[e.category as Category]&&['info','important','critical'].includes(e.severity)&&['automatic','manual','demo'].includes(e.provenance)&&Number.isFinite(Date.parse(e.occurredAt))&&Number.isFinite(Date.parse(e.collectedAt))&&(e.location===null||(Number.isFinite(e.location?.lon)&&Math.abs(e.location.lon)<=180&&Number.isFinite(e.location?.lat)&&Math.abs(e.location.lat)<=90&&typeof e.location.countryCode==='string')));}
export async function loadData(base:string):Promise<Data>{
 const names=['snapshot.json','geography.json','countries.geojson','events.json','demo.json'];
 const results=await Promise.allSettled(names.map(async n=>{const r=await fetch(`${base}data/${n}`,{cache:'no-cache'});if(!r.ok)throw Error(`${n}: ${r.status}`);return r.json();}));
 for(const i of [0,1,2])if(results[i].status==='rejected')throw Error(`${names[i]} unavailable`);
 const get=(i:number,fallback:any)=>results[i].status==='fulfilled'?(results[i] as PromiseFulfilledResult<any>).value:fallback;
 const feed=get(3,{schemaVersion:1,generatedAt:null,events:[],sources:[]});feed.events=(feed.events??[]).filter(validateEvent);
 const demo=get(4,{generatedAt:null,events:[],countries:[]});demo.events=(demo.events??[]).filter(validateEvent);
 return {snapshot:get(0,null),geography:get(1,null),features:get(2,null).features,feed,demo,feedError:results[3].status==='rejected'};
}
