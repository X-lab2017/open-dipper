/** Self-authored read-only OpenDigger snapshot builder. Node 20+, no dependencies. */
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const base='https://oss.open-digger.cn';
const docs='https://open-digger.cn/docs/user_docs/metrics/metrics_usage_guide';
export const metrics=[
 ['openrank','OpenRank','基于协作网络的影响力指标，不等同于质量、收入或市场份额。'],
 ['activity','活跃度','OpenDigger 定义的协作行为加权活跃度，不是事件总数。'],
 ['participants','参与者','当月参与协作的开发者指标；不同平台事件覆盖可能不同。'],
 ['contributors','贡献者','当月贡献者指标，不等同于参与者或所有提交作者。'],
 ['stars','新增 Star','当月 Star 事件数，不是仓库累计 Star 数。'],
 ['change_requests_accepted','合并变更请求','当月被接受的变更请求（GitHub PR 等），不是代码提交数。']
].map(([id,label,definition])=>({id,label,definition,definitionUrl:docs}));
export const selected=[
 ['github','X-lab2017/open-digger','数据观测'],['github','microsoft/vscode','开发工具'],
 ['github','kubernetes/kubernetes','云原生'],['github','apache/spark','数据基础设施'],
 ['github','apache/superset','数据可视化'],['github','duckdb/duckdb','数据基础设施'],
 ['github','ClickHouse/ClickHouse','数据基础设施'],['github','pytorch/pytorch','人工智能'],
 ['github','huggingface/transformers','人工智能'],['github','vllm-project/vllm','人工智能'],
 ['github','langchain-ai/langchain','人工智能'],['github','ollama/ollama','人工智能'],
 ['github','rust-lang/rust','编程语言'],['github','golang/go','编程语言'],
 ['github','facebook/react','Web 开发'],['github','vuejs/core','Web 开发'],
 ['github','grafana/grafana','可观测性'],
 ['gitlab','gitlab-org/modelops/applied-ml/code-suggestions/ai-assist','跨平台样本'],
 ['gitee','openharmony/arkui_ace_engine','跨平台样本'],
 ['atomgit','openharmony/docs','跨平台样本']
].map(([platform,path,category])=>({platform,path,category}));
export function sourceUrl(platform,path,file){
 return `${base}/${platform}/${path.split('/').map(encodeURIComponent).join('/')}/${file}.json`;
}
export function identity(platform,path,meta){
 const valid=meta?.type==='repo' && ((Number.isSafeInteger(meta.id)&&meta.id>0)||(typeof meta.id==='string'&&/^[1-9]\d*$/.test(meta.id)));
 return valid?{platform,entityType:'repo',id:String(meta.id),status:'resolved',key:`${platform}:repo:${meta.id}`}:
 {platform,entityType:'repo',id:null,status:'unresolved',key:`${platform}:unresolved-path:${path}`};
}
export function normalizeMetric(payload,{windowMonths=24}={}){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))return {status:'invalid',latestMonth:null,points:[],reason:'响应不是月份到数值的对象。',invalidMonths:[]};
 const months=Object.keys(payload).filter(k=>/^\d{4}-(0[1-9]|1[0-2])$/.test(k)).sort();
 const invalidMonths=months.filter(k=>typeof payload[k]!=='number'||!Number.isFinite(payload[k])||payload[k]<0);
 const valid=months.filter(k=>!invalidMonths.includes(k));
 const latestMonth=valid.at(-1)??null;
 if(!latestMonth)return {status:months.length?'invalid':'empty',latestMonth:null,points:[],reason:months.length?'所有月度值无效。':'未找到有效月度键。',invalidMonths};
 const latestIndex=Number(latestMonth.slice(0,4))*12+Number(latestMonth.slice(5))-1;
 return {status:'ok',latestMonth,points:valid.filter(k=>Number(k.slice(0,4))*12+Number(k.slice(5))-1>latestIndex-windowMonths).map(month=>({month,value:payload[month],flags:month==='2021-10'?['potential_interpolation']:[]})),invalidMonths,reason:invalidMonths.length?'无效月度值已排除；缺失月份未填零。':null};
}
export async function fetchJson(url,{fetchImpl=fetch,now=()=>new Date().toISOString(),timeoutMs=20000}={}){
 const provenance={url,fetchedAt:now(),sha256:null,httpStatus:null};
 try{
  const response=await fetchImpl(url,{signal:AbortSignal.timeout(timeoutMs),headers:{'User-Agent':'OpenDipper-review-snapshot/0.1','Accept':'application/json'}});
  provenance.httpStatus=response.status;
  if(!response.ok)return {status:response.status===404?'not_exported':'fetch_error',reason:response.status===404?'HTTP 404：指标未公开导出或路径不可用；不能推断为零或项目不存在。':`HTTP ${response.status}`,provenance};
  const raw=await response.text();
  provenance.sha256=createHash('sha256').update(raw).digest('hex');
  provenance.lastModified=response.headers.get('last-modified');
  try{return {status:'ok',data:JSON.parse(raw),provenance};}catch{return {status:'invalid',reason:'响应不是有效 JSON。',provenance};}
 }catch(error){return {status:'fetch_error',reason:error.name==='TimeoutError'?'请求超时。':`读取失败：${error.message}`,provenance};}
}
export function rankWithinPlatform(repositories,platform,metricId,month){
 if(!platform||platform==='all')throw new Error('Ranking requires one explicit platform; no cross-platform ranking or sum.');
 return repositories.filter(r=>r.platform===platform).flatMap(r=>{const point=r.metrics[metricId]?.points.find(p=>p.month===month);return point?[{key:r.key,value:point.value}]:[];}).sort((a,b)=>b.value-a.value);
}
async function main(){
 const startedAt=new Date().toISOString();
 const repos=selected.map(r=>({...r,name:r.path,metrics:{}}));
 const jobs=repos.flatMap(repo=>['meta',...metrics.map(m=>m.id)].map(metric=>({repo,metric})));
 let cursor=0;
 await Promise.all(Array.from({length:4},async()=>{while(cursor<jobs.length){
  const {repo,metric}=jobs[cursor++];
  const result=await fetchJson(sourceUrl(repo.platform,repo.path,metric));
  if(metric==='meta'){
   repo.identity=identity(repo.platform,repo.path,result.data);repo.key=repo.identity.key;
   repo.metaUpdatedAt=typeof result.data?.updatedAt==='number'&&Number.isFinite(result.data.updatedAt)&&!Number.isNaN(new Date(result.data.updatedAt).getTime())?new Date(result.data.updatedAt).toISOString():null;
   repo.metaProvenance=result.provenance;repo.metaStatus=result.status;
  }else repo.metrics[metric]=result.status==='ok'?{...normalizeMetric(result.data),provenance:result.provenance}:{status:result.status,reason:result.reason,latestMonth:null,points:[],provenance:result.provenance,invalidMonths:[]};
  process.stderr.write(`${repo.platform}/${repo.path} ${metric}: ${result.status}\n`);
  await new Promise(r=>setTimeout(r,150));
 }}));
 const snapshot={schemaVersion:1,fetchedAt:new Date().toISOString(),startedAt,selection:{type:'fixed_curated_sample',size:20,intent:'17 个 GitHub 跨生态项目与 GitLab、Gitee、AtomGit 各 1 个数据合同验证样本。非随机、非全球代表性清单；不合并跨平台排名。',platformCounts:{github:17,gitlab:1,gitee:1,atomgit:1},windowMonths:24},metrics,repositories:repos,limitations:['月度静态指标，不是实时事件流。','metaUpdatedAt 是导出时间，不代表各指标的最新数据月份。','缺失月、404、请求失败与显式 0 分开；不推断缺失原因。','只保留每个指标最近有效月份起向前 24 个日历月的实际点。','公开数据独立许可与再分发条款仍待核定；源码许可不自动适用于数据。'],source:{provider:'OpenDigger',baseUrl:base,documentationUrl:docs,upstreamSourceCommit:'5c2ffc4f5b3dd37ebcb20514c7abfee6853bd830',productionVersionVerified:false}};
 const destination=new URL('../public/data/snapshot.json',import.meta.url);
 await mkdir(new URL('../public/data/',import.meta.url),{recursive:true});
 await writeFile(destination,JSON.stringify(snapshot,null,2)+'\n');
 console.log(`Wrote ${fileURLToPath(destination)}; ${repos.filter(r=>r.identity.status==='resolved').length}/20 identities resolved.`);
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL(`file://${process.argv[1]}`)))await main();
