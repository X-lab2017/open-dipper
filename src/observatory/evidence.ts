/** Optional observed snapshot. No dependency on demo fixtures or UI state. */
import type {Country} from './model';
export const atlasKeys=['developers','contribution','influence'] as const;
export type AtlasMetric=typeof atlasKeys[number];
export type SupplyMetric='models'|'datasets';
export type EvidenceRow={code:string;rawCode:string|null;name:string;nameZh:string;value:number;rank:number;longitude:number|null;latitude:number|null};
type Source={url:string;retrievedAt:string;sha256:string};
export type Evidence={schemaVersion:1;dataStatus:'observed';globalDevelopers:{value:number;year:string;sourceKey:'developers'};maps:Record<AtlasMetric,{source:Source;title:string;observedPeriod:null;unknownRegionTotal:null;rows:EvidenceRow[]}>;supply:{asOf:string;retrievedAt:string;models:number;datasets:number;monthly:{month:string;models:number|null;datasets:number|null}[];latestMonthCompleteness:'unknown';source:{repository:string;commit:string;path:string;gitBlobSha:string}}};
export const atlasNames:Record<AtlasMetric,[string,string]>={developers:['开发者规模','Developer stock'],contribution:['开发者贡献 · OpenRank','Developer contribution · OpenRank'],influence:['项目影响力 · OpenRank','Project influence · OpenRank']};
const count=(x:unknown)=>typeof x==='number'&&Number.isSafeInteger(x)&&x>=0;
const nonnegative=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const http=(x:unknown)=>{try{return typeof x==='string'&&['http:','https:'].includes(new URL(x).protocol);}catch{return false;}};
const stamp=(x:unknown)=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const digest=(x:unknown,n:number)=>typeof x==='string'&&new RegExp(`^[a-f0-9]{${n}}$`).test(x);
export function validateEvidence(x:any):x is Evidence{
 try{
  if(x?.schemaVersion!==1||x.dataStatus!=='observed'||!count(x.globalDevelopers?.value)||!/^20\d{2}$/.test(x.globalDevelopers?.year)||x.globalDevelopers.sourceKey!=='developers')return false;
  for(const key of atlasKeys){
   const m=x.maps[key],s=m.source;
   if(!http(s.url)||!stamp(s.retrievedAt)||!digest(s.sha256,64)||m.observedPeriod!==null||m.unknownRegionTotal!==null||typeof m.title!=='string'||!Array.isArray(m.rows)||!m.rows.length||m.rows.length>300)return false;
   const seen=new Set();
   for(const r of m.rows){
    if(typeof r.code!=='string'||!/^[A-Z]{2}$/.test(r.code)||seen.has(r.code)||!(r.rawCode===null||/^[A-Z]{3}$/.test(r.rawCode))||typeof r.name!=='string'||typeof r.nameZh!=='string'||!nonnegative(r.value)||(key==='developers'&&!count(r.value))||!Number.isSafeInteger(r.rank)||r.rank<1)return false;
    if(!((r.longitude===null&&r.latitude===null)||(typeof r.longitude==='number'&&Number.isFinite(r.longitude)&&Math.abs(r.longitude)<=180&&typeof r.latitude==='number'&&Number.isFinite(r.latitude)&&Math.abs(r.latitude)<=90)))return false;
    seen.add(r.code);
   }
  }
  const s=x.supply;
  if(!count(s.models)||!count(s.datasets)||!/^20\d{2}-\d{2}-\d{2}$/.test(s.asOf)||!stamp(s.asOf)||!stamp(s.retrievedAt)||s.latestMonthCompleteness!=='unknown'||s.source.repository!=='X-lab2017/2026-Global-Open-Source-Development-Report'||!digest(s.source.commit,40)||!digest(s.source.gitBlobSha,40)||s.source.path!=='preview/content/gosm/supply-observation.json'||!Array.isArray(s.monthly)||!s.monthly.length||s.monthly.length>600)return false;
  let prev='';for(const r of s.monthly){if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(r.month)||r.month<=prev||r.month>s.asOf.slice(0,7)||!(r.models===null||count(r.models))||!(r.datasets===null||count(r.datasets)))return false;prev=r.month;}
  return true;
 }catch{return false;}
}
export async function loadEvidence(base:string):Promise<Evidence|null>{try{const r=await fetch(`${base}data/evidence.json`,{cache:'no-cache'});if(!r.ok)return null;const x=await r.json();return validateEvidence(x)?x:null;}catch{return null;}}
export function atlasCountries(e:Evidence,key:AtlasMetric):Country[]{return e.maps[key].rows.map(r=>({country:r.code==='TW'?'Taiwan, China':r.name,countryZh:r.nameZh,rawCode:r.rawCode??`unmapped:${r.code}`,sourceCode:r.code,longitude:r.longitude,latitude:r.latitude,atlasValue:r.value}));}
export function supplyWindow(e:Evidence){const last=e.supply.monthly.at(-1)!.month,[y,m]=last.split('-').map(Number);return Array.from({length:12},(_,i)=>{const month=new Date(Date.UTC(y,m-12+i,1)).toISOString().slice(0,7);return e.supply.monthly.find(r=>r.month===month)??{month,models:null,datasets:null};});}
export const reportUrl=(e:Evidence)=>`https://github.com/${e.supply.source.repository}/blob/${e.supply.source.commit}/${e.supply.source.path}`;
