/** Small, offline adapter. Source extracts are retained; no network or silent fallback. */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const keys=['developers','contribution','influence'];
const positive=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function adaptEvidence(inputs,anchors,supply){
  if(supply.meta.containsSimulatedData!==false||supply.meta.dataStatus!=='observed')throw Error('Observed supply required');
  const index=new Map(anchors.rows.map(r=>[r.code,r]));
  if(index.size!==anchors.rows.length)throw Error('Duplicate anchors');
  const maps={};
  for(const key of keys){
    const input=inputs[key],seen=new Set();
    const titles={developers:'Latest Total Developers by Country',contribution:'Developer OpenRank Contribution by Country',influence:'Open Source Project OpenRank Influence by Country'};
    if(input.leaderboard.title!==titles[key])throw Error('Regional board changed');
    if(!input?.leaderboard?.data?.length||input.leaderboard.data.length>300)throw Error('Missing/bounded regional board');
    const rows=input.leaderboard.data.map(r=>{
      if(typeof r.code!=='string'||!r.code.match(/^[A-Z]{2}$/)||seen.has(r.code)||!positive(r.value)||!Number.isInteger(r.rank)||r.rank<1||typeof r.name!=='string'||typeof r.name_zh!=='string')throw Error('Invalid regional observation');
      if(key==='developers'&&!Number.isSafeInteger(r.value))throw Error('Developer stock must be an integer');
      seen.add(r.code);const a=index.get(r.code);
      if(a&&(!Number.isFinite(a.longitude)||Math.abs(a.longitude)>180||!Number.isFinite(a.latitude)||Math.abs(a.latitude)>90||!/^[A-Z]{3}$/.test(a.rawCode)))throw Error('Invalid map-label anchor');
      return {code:r.code,rawCode:a?.rawCode??null,name:r.name,nameZh:r.code==='TW'?'中国台湾':r.name_zh,value:r.value,rank:r.rank,longitude:a?.longitude??null,latitude:a?.latitude??null};
    });
    maps[key]={source:input.source,title:input.leaderboard.title,observedPeriod:null,unknownRegionTotal:null,rows};
  }
  const trend=inputs.developers.trend;
  if(trend.title!=='Global Total Developers'||trend.labels.length!==trend.values.length)throw Error('Global developer trend mismatch');
  const year=trend.labels.at(-1),value=trend.values.at(-1);
  if(!/^20\d{2}$/.test(year)||!Number.isSafeInteger(value)||value<0)throw Error('Invalid global total');
  const monthlyIndex=kind=>{
    const a=supply[kind].monthlyNew,m=new Map();
    if(!Array.isArray(a)||!a.length||a.length>600)throw Error('Missing/bounded monthly series');
    for(const row of a){if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(row.month)||!Number.isSafeInteger(row.count)||row.count<0||m.has(row.month))throw Error('Invalid monthly observation');m.set(row.month,row.count);}
    return m;
  };
  const models=monthlyIndex('models'),datasets=monthlyIndex('datasets');
  const months=[...new Set([...models.keys(),...datasets.keys()])].sort();
  const monthly=months.map(month=>({month,models:models.get(month)??null,datasets:datasets.get(month)??null}));
  const date=supply.meta.platformAsOf;
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date)||supply.models.summary.last_updated!==date||supply.datasets.summary.last_updated!==date)throw Error('Supply total dates mismatch');
  for(const x of [supply.models.summary.total,supply.datasets.summary.total])if(!Number.isSafeInteger(x)||x<0)throw Error('Invalid supply total');
  return {schemaVersion:1,dataStatus:'observed',globalDevelopers:{value,year,sourceKey:'developers'},maps,supply:{asOf:date,retrievedAt:supply.meta.retrievedAtUTC,models:supply.models.summary.total,datasets:supply.datasets.summary.total,monthly,latestMonthCompleteness:'unknown',source:supply.source,upstreamSources:supply.sources},cartography:anchors.source};
}
async function main(){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
  const inputs=Object.fromEntries(await Promise.all(keys.map(async k=>[k,await read('data/reference/openshare-'+k+'.json')])));
  const result=adaptEvidence(inputs,await read('config/country-anchors.json'),await read('data/reference/gosd-supply.json'));
  result.extracts={};
  for(const p of [...keys.map(k=>'data/reference/openshare-'+k+'.json'),'data/reference/gosd-supply.json','config/country-anchors.json'])result.extracts[p]=crypto.createHash('sha256').update(await fs.readFile(path.join(root,p))).digest('hex');
  const out=JSON.stringify(result,null,2)+'\n',dest=path.join(root,'public/data/evidence.json');
  if(process.argv.includes('--check')){if(await fs.readFile(dest,'utf8')!==out)throw Error('Evidence output stale: npm run evidence:build');console.log('Evidence output verified');}
  else{await fs.writeFile(dest,out);console.log('Evidence built:',Object.entries(result.maps).map(([k,m])=>k+' '+m.rows.length).join(', '),'; supply months',result.supply.monthly.length);}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
