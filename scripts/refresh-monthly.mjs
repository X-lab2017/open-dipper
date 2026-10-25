/** Preserve last good values when an upstream monthly request fails. */
import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const path='public/data/snapshot.json';
const prior=JSON.parse(await fs.readFile(path,'utf8'));
const result=spawnSync(process.execPath,['scripts/fetch-data.mjs'],{stdio:'inherit'});
if(result.status!==0)throw Error('Monthly refresh failed; previous snapshot retained');
const next=JSON.parse(await fs.readFile(path,'utf8'));
for(const repo of next.repositories){
 const old=prior.repositories.find(r=>r.platform===repo.platform&&r.path===repo.path);
 for(const [id,series] of Object.entries(repo.metrics)){
  if(['fetch_error','invalid'].includes(series.status)&&old?.metrics[id]?.points.length){
   repo.metrics[id]={...old.metrics[id],refreshStatus:'stale',lastAttempt:series.provenance.fetchedAt,lastError:series.reason};
  }
 }
}
await fs.writeFile(path,JSON.stringify(next,null,2)+'\n');
