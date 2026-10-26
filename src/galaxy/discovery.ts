import type {GalaxyIndex,GalaxyItem} from './types';
import {queryScore} from './model';
export type DiscoveryTask='all'|'agents'|'retrieval'|'inference'|'data';
export type DiscoverySort='relevance'|'connections'|'name';
export type TaskSpec={id:DiscoveryTask;name:[string,string];description:[string,string];seeds:string[];terms:string[];categories:string[]};
export const tasks:TaskSpec[]=[
 {id:'all',name:['自由探索','Explore all'],description:['按名称、用途、主题或语言搜索；选中项目后生成报告。','Search names, tasks, topics or languages; select a project to build its report.'],seeds:[],terms:[],categories:[]},
 {id:'agents',name:['搭建 Agent','Build agents'],description:['从编排、工作流和工具协议寻找入口。按已知项目与元数据匹配，不是采用评级。','Explore orchestration, workflows and tool protocols. Matches use known entry points and metadata, not adoption ratings.'],seeds:['https://github.com/langchain-ai/langchain','https://github.com/langchain-ai/langgraph','https://github.com/microsoft/autogen','https://github.com/crewAIInc/crewAI','https://github.com/modelcontextprotocol/servers','https://github.com/n8n-io/n8n'],terms:['agentic','multi-agent','llm-agent','agent-framework','model-context-protocol','workflow automation'],categories:['Agentic AI']},
 {id:'retrieval',name:['检索与 RAG','Retrieval & RAG'],description:['一起发现检索软件、向量模型与相关数据，再分别核验能力。','Discover retrieval software, embedding models and relevant data; validate each on your task.'],seeds:['https://github.com/run-llama/llama_index','https://github.com/qdrant/qdrant','https://github.com/milvus-io/milvus','https://huggingface.co/BAAI/bge-m3','https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2'],terms:['rag','retrieval','embedding','vector database','sentence-transformers'],categories:['feature-extraction','sentence-similarity','text-ranking','text-retrieval']},
 {id:'inference',name:['模型推理','Serve models'],description:['寻找运行时、推理引擎与部署工具；硬件和成本仍需实际试用。','Find runtimes, inference engines and serving tools; hardware and cost need practical validation.'],seeds:['https://github.com/vllm-project/vllm','https://github.com/ggml-org/llama.cpp','https://github.com/ollama/ollama','https://github.com/sgl-project/sglang','https://github.com/triton-lang/triton'],terms:['inference','model serving','llm serving','llama.cpp','text-generation-inference'],categories:[]},
 {id:'data',name:['训练与评测数据','Training & evaluation data'],description:['从训练语料和任务评测集开始，核验许可、版本及数据污染风险。','Start with training corpora and task benchmarks; verify license, version and contamination risks.'],seeds:['https://huggingface.co/datasets/HuggingFaceFW/fineweb','https://huggingface.co/datasets/princeton-nlp/SWE-bench_Verified','https://huggingface.co/datasets/tatsu-lab/alpaca','https://huggingface.co/datasets/openai/gsm8k'],terms:[],categories:[]}
];
export const taskById=(id:DiscoveryTask)=>tasks.find(t=>t.id===id)??tasks[0];
const key=(s:string)=>s.toLowerCase().replace(/\/$/,'');
export function taskMatch(n:GalaxyItem,id:DiscoveryTask):{matched:boolean;reason:'seed'|'category'|'metadata'|'type'|'all'}{
 const t=taskById(id);if(id==='all')return{matched:true,reason:'all'};
 if(t.seeds.some(s=>key(s)===key(n.url)))return{matched:true,reason:'seed'};
 if(id==='data')return{matched:n.kind==='dataset',reason:'type'};
 if(id==='agents'&&n.source==='code'&&!['AI','Agentic AI'].includes(n.category))return{matched:t.terms.some(q=>queryScore(n,q)>0),reason:'metadata'};
 if(id==='inference'&&(n.source!=='code'||!['AI','Agentic AI'].includes(n.category)&&!['llm','model','deep-learning','machine-learning','neural','gpu','tensor'].some(q=>queryScore(n,q)>0)))return{matched:false,reason:'metadata'};
 if(t.categories.includes(n.category))return{matched:true,reason:'category'};
 return{matched:t.terms.some(q=>queryScore(n,q)>0),reason:'metadata'};
}
const degreeCache=new WeakMap<GalaxyIndex,number[]>();
export function recordedDegrees(index:GalaxyIndex){let degrees=degreeCache.get(index);if(degrees)return degrees;
 const adj=index.nodes.map(()=>new Set<number>());for(const e of index.edges)if(!e.inferred){adj[e.source].add(e.target);adj[e.target].add(e.source);}degrees=adj.map(s=>s.size);degreeCache.set(index,degrees);return degrees;
}
const taskCache=new WeakMap<GalaxyIndex,Map<DiscoveryTask,Set<number>>>();
export function discover(index:GalaxyIndex,ids:number[],task:DiscoveryTask,query:string,sort:DiscoverySort){
 let taskIds:Set<number>|undefined;
 if(task!=='all'){let cache=taskCache.get(index);if(!cache){cache=new Map();taskCache.set(index,cache);}taskIds=cache.get(task);if(!taskIds){taskIds=new Set(index.nodes.flatMap((n,i)=>taskMatch(n,task).matched?[i]:[]));cache.set(task,taskIds);}}
 const degrees=recordedDegrees(index),t=taskById(task),seeds=new Set(t.seeds.map(key)),scores=new Map<number,number>();
 const matches=ids.filter(i=>{if(taskIds&&!taskIds.has(i))return false;const score=queryScore(index.nodes[i],query);if(score)scores.set(i,score);return score>0;});
 return matches.sort((a,b)=>{
  const x=index.nodes[a],y=index.nodes[b];if(sort==='name')return x.name.localeCompare(y.name);
  if(sort==='connections')return degrees[b]-degrees[a]||x.name.localeCompare(y.name);
  if(query&&scores.get(a)!==scores.get(b))return scores.get(b)!-scores.get(a)!;
  return Number(seeds.has(key(y.url)))-Number(seeds.has(key(x.url)))||y.score-x.score||x.name.localeCompare(y.name);
 });
}
export function sameDomainPeers(index:GalaxyIndex,id:number,limit=6){
 const n=index.nodes[id];if(!n)return[];const tags=new Set(n.topics??[]);
 return index.nodes.map((x,i)=>({i,node:x,overlap:(x.topics??[]).filter(t=>tags.has(t)).length})).filter(x=>x.i!==id&&x.node.source===n.source&&x.node.kind===n.kind&&x.node.category===n.category).sort((a,b)=>b.overlap-a.overlap||Number(b.node.language===n.language)-Number(a.node.language===n.language)||b.node.score-a.node.score||a.node.name.localeCompare(b.node.name)).slice(0,limit);
}
export type ConnectionPath={nodes:number[];edges:number[];status:'found'|'different-networks'|'not-found'|'same'};
export function findRecordedPath(index:GalaxyIndex,from:number,to:number,maxHops=3):ConnectionPath{
 if(!index.nodes[from]||!index.nodes[to])return{nodes:[],edges:[],status:'not-found'};
 if(from===to)return{nodes:[from],edges:[],status:'same'};
 if(index.nodes[from].source!==index.nodes[to].source)return{nodes:[],edges:[],status:'different-networks'};
 const parents=new Map<number,{parent:number;edge:number;depth:number}>(),queue=[from];parents.set(from,{parent:-1,edge:-1,depth:0});
 for(let p=0;p<queue.length;p++){const id=queue[p],depth=parents.get(id)!.depth;if(depth>=Math.min(4,maxHops))continue;
  for(const ei of index.neighbors.get(id)??[]){const e=index.edges[ei];if(e.inferred)continue;const next=e.source===id?e.target:e.source;if(parents.has(next))continue;parents.set(next,{parent:id,edge:ei,depth:depth+1});
   if(next===to){const nodes=[to],edges:number[]=[];let x=to;while(x!==from){const d=parents.get(x)!;edges.unshift(d.edge);nodes.unshift(d.parent);x=d.parent;}return{nodes,edges,status:'found'};}queue.push(next);
  }
 }return{nodes:[],edges:[],status:'not-found'};
}
export function shortlistToggle(keys:string[],key:string,index:GalaxyIndex){
 const ids=[...new Set(keys.filter(k=>index.byKey.has(k)))].slice(0,3);if(ids.includes(key))return{keys:ids.filter(k=>k!==key),limited:false};
 if(!index.byKey.has(key))return{keys:ids,limited:false};if(ids.length>=3)return{keys:ids,limited:true};return{keys:[...ids,key],limited:false};
}
