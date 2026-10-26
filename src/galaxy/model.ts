import type {GalaxyGraph,GalaxyIndex,GalaxyItem,GalaxyLink,GalaxyFilter,GalaxySource} from './types';

export const relationLabels:Record<string,[string,string]>={
 'shared-contributors':['共享贡献者','Shared contributors'],
 'base-model':['模型派生关联','Model lineage'],
 'declared-dataset':['声明关联数据集','Declared dataset'],
 'uses-model':['应用使用模型','Space uses model'],
 'uses-dataset':['应用使用数据集','Space uses dataset'],
 'same-author':['同一发布账号','Same publisher'],
 'inferred-task':['任务相近 · 推断','Similar task · inferred'],
 'inferred-taxonomy':['分类相近 · 推断','Related taxonomy · inferred']
};
export const kindLabels:Record<string,[string,string]>={repository:['代码仓库','Repository'],repo:['代码仓库','Repository'],model:['模型','Model'],dataset:['数据集','Dataset'],space:['应用 Space','Space']};
const translations:Record<string,string>={
 'Development Tools':'开发工具','Application Software':'应用软件','AI':'人工智能','Agentic AI':'智能体 AI',
 'Web Frameworks':'Web 框架','Operating System':'操作系统','Database':'数据库','Blockchain':'区块链','Big Data':'大数据','Programming Language':'编程语言','IoT':'物联网',
 'interactive-demo':'交互应用','unspecified-dataset':'未标注任务的数据集','unspecified-model':'未标注任务的模型','image-text-to-text':'图文理解',
 'image-to-image':'图像转换','any-to-any':'多模态转换','other':'其他','image-to-video':'图生视频','robotics':'机器人','text-to-video':'文生视频',
 'image-to-3d':'图像到三维','audio-to-audio':'音频转换','image-feature-extraction':'图像特征提取','text-to-audio':'文本到音频','text-ranking':'文本排序',
 'image-text-to-video':'图文到视频','depth-estimation':'深度估计','video-text-to-text':'视频理解','video-to-video':'视频转换','text-retrieval':'文本检索',
 'multiple-choice':'多项选择','zero-shot-image-classification':'零样本图像分类','audio-text-to-text':'音频理解','time-series-forecasting':'时间序列预测',
 'visual-question-answering':'视觉问答','image-text-to-image':'图文到图像','table-to-text':'表格到文本','video-classification':'视频分类',
 'mask-generation':'掩码生成','voice-activity-detection':'语音活动检测','zero-shot-classification':'零样本分类','text-to-3d':'文本到三维',
 'keypoint-detection':'关键点检测','document-question-answering':'文档问答','graph-ml':'图机器学习','visual-document-retrieval':'视觉文档检索',
 'tabular-regression':'表格回归','tabular-to-text':'表格到文本','zero-shot-object-detection':'零样本目标检测','table-question-answering':'表格问答','text_generation':'文本生成',
 'AI & Machine Learning':'人工智能与机器学习','AI & ML':'人工智能与机器学习','Artificial Intelligence':'人工智能',
 'Developer Tools':'开发工具','DevTools':'开发工具','Data & Analytics':'数据与分析','Data Infrastructure':'数据基础设施',
 'Cloud & Infrastructure':'云与基础设施','Cloud Native':'云原生','Web & Frontend':'Web 与前端','Frontend':'前端',
 'Languages & Runtimes':'语言与运行时','Programming Languages':'编程语言','Systems & Infrastructure':'系统与基础设施',
 'Security':'安全','Science & Education':'科学与教育','Other':'其他','Unclassified':'未分类','Unknown':'未知',
 'text-generation':'文本生成','text2text-generation':'文本到文本','text-classification':'文本分类',
 'image-classification':'图像分类','text-to-image':'文生图','image-to-text':'图像理解',
 'automatic-speech-recognition':'语音识别','text-to-speech':'语音合成','feature-extraction':'特征提取',
 'sentence-similarity':'语义相似','question-answering':'问答','token-classification':'词元分类',
 'translation':'翻译','summarization':'摘要','fill-mask':'掩码预测','object-detection':'目标检测',
 'image-segmentation':'图像分割','audio-classification':'音频分类','unconditional-image-generation':'图像生成',
 'tabular-classification':'表格分类','reinforcement-learning':'强化学习','multimodal':'多模态',
 'Other / Unknown':'其他 / 未知','unknown':'未标注任务'
};
export function categoryLabel(s:string,lang:string){return lang==='zh'?(translations[s]??s):s;}
export function validGraph(value:unknown):value is GalaxyGraph{
 const g=value as GalaxyGraph;
 if(!g?.meta||!['code','model'].includes(g.meta.source)||!Array.isArray(g.nodes)||!Array.isArray(g.edges)||!Array.isArray(g.meta.relationTypes))return false;
 if(!g.nodes.length||g.nodes.length>100000||g.edges.length>500000||g.meta.nodeCount!==g.nodes.length||g.meta.edgeCount!==g.edges.length)return false;
 const keys=new Set<string>();
 for(const n of g.nodes){if(!n||typeof n.id!=='string'||keys.has(n.id)||typeof n.name!=='string'||typeof n.category!=='string'||typeof n.kind!=='string'||![n.x,n.y,n.size].every(Number.isFinite)||n.size<0||!/^https?:\/\//.test(n.url))return false;keys.add(n.id);}
 return g.edges.every(e=>Array.isArray(e)&&e.length===6&&Number.isInteger(e[0])&&Number.isInteger(e[1])&&e[0]>=0&&e[1]>=0&&e[0]<g.nodes.length&&e[1]<g.nodes.length&&e[0]!==e[1]&&Number.isFinite(e[2])&&e[2]>=0&&Number.isInteger(e[3])&&e[3]>=0&&e[3]<g.meta.relationTypes.length&&(e[4]===null||Number.isFinite(e[4]))&&(e[5]===0||e[5]===1));
}
export function buildIndex(graphs:Partial<Record<GalaxySource,GalaxyGraph>>):GalaxyIndex{
 const nodes:GalaxyItem[]=[],edges:GalaxyLink[]=[],byKey=new Map<string,number>(),neighbors=new Map<number,number[]>();
 const counts=new Map<string,number>();for(const graph of Object.values(graphs))for(const n of graph.nodes)counts.set(n.category,(counts.get(n.category)??0)+1);
 const categories=[...counts].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 for(const source of ['code','model'] as const){const g=graphs[source];if(!g)continue;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,maxSize=1;
  for(const n of g.nodes){minX=Math.min(minX,n.x);maxX=Math.max(maxX,n.x);minY=Math.min(minY,n.y);maxY=Math.max(maxY,n.y);maxSize=Math.max(maxSize,n.size);}
  const scale=1.12/Math.max(maxX-minX,maxY-minY,1e-8),offset=nodes.length,cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  const localCategories=[...new Set(g.nodes.map(n=>n.category))].sort((a,b)=>(counts.get(b)??0)-(counts.get(a)??0));
  for(let i=0;i<g.nodes.length;i++){const n=g.nodes[i],key=`${source}:${n.id}`;byKey.set(key,nodes.length);nodes.push({...n,key,source,index:i,gx:(n.x-cx)*scale+(source==='code'?-.64:.64),gy:(n.y-cy)*scale,score:Math.log1p(n.size)/Math.log1p(maxSize),colorIndex:localCategories.indexOf(n.category)%8});}
  for(const e of g.edges){const i=edges.length,s=offset+e[0],t=offset+e[1];edges.push({source:s,target:t,strength:e[2],kind:g.meta.relationTypes[e[3]],shared:e[4],inferred:e[5]===1});for(const n of [s,t]){if(!neighbors.has(n))neighbors.set(n,[]);neighbors.get(n)!.push(i);}}
 }
 return {nodes,edges,byKey,neighbors,graphs,categories};
}
export function filteredNodes(index:GalaxyIndex,f:GalaxyFilter,watched:Set<string>):number[]{
 const result:number[]=[];
 for(let i=0;i<index.nodes.length;i++){const n=index.nodes[i];if(f.mode!=='all'&&n.source!==f.mode)continue;if(f.category&&n.category!==f.category)continue;if(f.kind!=='all'&&n.kind!==f.kind)continue;if(f.language&&n.language!==f.language)continue;if(f.watchedOnly&&!watched.has(n.key))continue;if(!queryScore(n,f.query))continue;result.push(i);}
 return result;
}
const aliases:Record<string,string[]>={'智能体':['agent','agentic'],'检索':['retrieval','embedding','rag','vector','sentence-similarity','feature-extraction'],'向量':['embedding','vector','sentence-similarity','feature-extraction'],'推理':['inference','serving'],'语音':['speech','audio','whisper'],'图像':['image','vision'],'数据集':['dataset'],'大模型':['llm','text-generation'],'代码':['coding','code'],'中文':['chinese','zh'],'机器人':['robotics','embodied']};
export function queryScore(n:GalaxyItem,q:string):number{
 q=q.trim().toLocaleLowerCase();if(!q)return 1;
 if(n.url.toLowerCase().replace(/\/$/,'')===q.replace(/\/$/,''))return 1000;
 const fields=[n.name,n.topics?.join(' ')??'',n.language??'',n.category,n.description??'',n.author??''].map(s=>s.toLowerCase());
 let score=0;for(const term of q.split(/\s+/).slice(0,12)){const terms=[term,...(aliases[term]??[])];let hit=0;for(const word of terms)for(let j=0;j<fields.length;j++){
  const found=/^[a-z0-9]{1,4}$/.test(word)?new RegExp(`\\b${word}\\b`,'i').test(fields[j]):fields[j].includes(word);
  if(found)hit=Math.max(hit,[24,16,12,10,4,8][j]);
 }if(!hit)return 0;score+=hit;}
 if(fields[0]===q)score+=500;else if(n.name.split('/').at(-1)!.toLowerCase()===q)score+=200;return score;
}
export function allowedLink(e:GalaxyLink,f:Pick<GalaxyFilter,'inferred'|'relation'>){return (!e.inferred||f.inferred)&&(f.relation==='all'||e.kind===f.relation);}
export function connectedNodes(index:GalaxyIndex,id:number,f:Pick<GalaxyFilter,'inferred'|'relation'>){
 return (index.neighbors.get(id)??[]).map(i=>({edge:index.edges[i],edgeIndex:i})).filter(({edge})=>allowedLink(edge,f)).map(({edge,edgeIndex})=>({node:edge.source===id?edge.target:edge.source,edge,edgeIndex})).sort((a,b)=>Number(a.edge.inferred)-Number(b.edge.inferred)||b.edge.strength-a.edge.strength);
}
export function findByUrl(index:GalaxyIndex,url:string){const normalize=(s:string)=>s.replace(/\/$/,'').toLocaleLowerCase();return index.nodes.findIndex(n=>normalize(n.url)===normalize(url));}
export function scopeDate(g:GalaxyGraph){const p=g.meta.period as {start?:string;end?:string}|undefined;return p?.start&&p?.end?`${p.start.slice(0,4)}.${p.start.slice(4,6)}—${p.end.slice(0,4)}.${p.end.slice(4,6)}`:g.meta.snapshotAt?.slice(0,10)??'—';}
