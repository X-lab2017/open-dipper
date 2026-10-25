import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=async p=>JSON.parse(await fs.readFile(new URL(p,root),'utf8'));
export function adaptObservation(labels,supply,anchors){
 if(supply.meta.dataStatus!=='observed'||supply.meta.containsSimulatedData!==false)throw Error('Observed publisher geography required');
 const ids=new Set();const groups={company:0,research:0,foundation:0,community:0,public:0};
 for(const l of labels.labels){if(!l.id||ids.has(l.id)||!(l.group in groups)||!/^[a-f0-9]{64}$/.test(l.sha256))throw Error('Invalid organization label');ids.add(l.id);groups[l.group]++;}
 if(!Number.isSafeInteger(labels.repositories.count)||labels.repositories.count<0)throw Error('Invalid repository coverage');
 const index=new Map(anchors.rows.map(r=>[r.code,r]));
 const maps={};for(const key of ['models','datasets']){
  const seen=new Set();const rows=supply.assets[key].countries.map(r=>{
   if(!/^[A-Z]{2}$/.test(r.code)||seen.has(r.code)||!Number.isSafeInteger(r.value)||r.value<0||!Number.isSafeInteger(r.downloads)||r.downloads<0)throw Error('Invalid publisher country');seen.add(r.code);
   const a=index.get(r.code);return {code:r.code,rawCode:a?.rawCode??null,name:r.name,nameZh:r.code==='TW'?'中国台湾':r.name_zh,value:r.organizations>0?r.value:null,downloads:r.organizations>0?r.downloads:null,organizations:r.organizations,longitude:a?.longitude??null,latitude:a?.latitude??null};
  });
  if(rows.reduce((n,r)=>n+(r.value??0),0)!==supply.assets[key].summary[key])throw Error('Publisher sample total mismatch');
  maps[key]={rows,total:supply.assets[key].summary[key],organizations:supply.assets[key].summary.organizations,observedPeriod:null};
 }
 return {schemaVersion:1,organizations:{total:ids.size,groups,source:labels.source,manifestSha256:labels.manifestSha256},repositories:{...labels.repositories,source:labels.source},publisher:{source:supply.source,retrievedAt:supply.meta.retrievedAtUTC,maps},facilities:{status:'not_connected',count:null}};
}
async function main(){const result=adaptObservation(await read('data/reference/labeled-organizations.json'),await read('data/reference/gosd-geography.json'),await read('config/country-anchors.json'));const target=new URL('public/data/observation.json',root),body=JSON.stringify(result,null,2)+'\n';if(process.argv.includes('--check')){if(await fs.readFile(target,'utf8')!==body)throw Error('Run npm run observation:build');console.log('Observation snapshot verified');}else{await fs.writeFile(target,body);console.log('Observation snapshot built');}}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
