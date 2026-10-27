import {layerTones} from './design/palette';
import {countryName,regionMatches,type Country,type Event,type Lang,type Feed} from './observatory/model';
export type LayerId='developers'|'contribution'|'talent'|'companies'|'foundations'|'research'|'influence'|'benchmark'|'emerging'|'llm'|'code'|'models'|'datasets'|'content'|'energy'|'compute'|'news'|'meetings';
export type Layer={id:LayerId;name:[string,string];kind:'area'|'bubble'|'point';color:string;light:string;unit:[string,string];metric:[string,string];scope:[string,string];demo?:boolean};
const area=(id:LayerId,name:[string,string],unit:[string,string],scope:[string,string],metric=name):Layer=>({id,name,kind:'area',color:layerTones[id].dark,light:layerTones[id].light,unit,metric,scope});
const bubble=(...args:Parameters<typeof area>):Layer=>({...area(...args),kind:'bubble'});
const point=(id:LayerId,name:[string,string],metric:[string,string],scope:[string,string]):Layer=>({id,name,kind:'point',color:layerTones[id].dark,light:layerTones[id].light,unit:['个已定位实体','located entities'],metric,scope});
export const layers:Layer[]=[
 area('developers',['活跃开发者','Active developers'],['人','people'],['GitHub · 2025.07—2026.06','GitHub · Jul 2025–Jun 2026'],['活跃开发者数','Active developer count']),
 area('contribution',['开发者贡献','Developer contribution'],['OpenRank','OpenRank'],['2025 自然年 · 地域快照','Calendar 2025 · regional snapshot']),
 area('talent',['高影响力人才','High-impact talent'],['人','people'],['2026.07 · 前 5% 样本','July 2026 · top 5% sample']),
 point('companies',['企业','Companies'],['总部所在地','Headquarters'],['报告原表 · 已核验总部样本','Report table · verified HQ sample']),
 point('foundations',['基金会','Foundations'],['注册地','Registered locality'],['报告原表 · 登记地址样本','Report table · registered address sample']),
 point('research',['高校与科研','Universities & research'],['机构所在地','Institution location'],['官方地点样本 · 指标待补','Official location sample · metrics pending']),
 area('influence',['项目影响力','Project influence'],['OpenRank','OpenRank'],['2025 自然年 · 地域 Top 30','Calendar 2025 · regional top 30']),
 point('benchmark',['标杆项目','Benchmark projects'],['关联组织所在地','Associated organization location'],['报告原表 Top 30 · 组织归属点','Original report top 30 · organization reference']),
 point('emerging',['新势力项目','Emerging projects'],['关联组织所在地','Associated organization location'],['报告新项目 Top 30 · 组织归属点','Report new-project top 30 · organization reference']),
 point('llm',['大模型项目','Large-model projects'],['发布方所在地','Publisher location'],['2026.08 · 模型版本原表 Top 20','Aug 2026 · original top 20 model versions']),
 bubble('code',['代码资产','Code assets'],['个活跃仓库','active repositories'],['2026 报告年度 · 地域待补','2026 report year · geography pending']),
 bubble('models',['模型资产','Model assets'],['个模型仓库','model repositories'],['发布单位样本 · 累计时点未披露','Publisher sample · cumulative date undisclosed']),
 bubble('datasets',['数据资产','Data assets'],['个数据集','datasets'],['发布单位样本 · 累计时点未披露','Publisher sample · cumulative date undisclosed']),
 bubble('content',['内容资产','Content assets'],['项内容资产','content assets'],['实体口径与地域数据待补','Definition & regional data pending']),
 point('energy',['电力与能源设施','Power & energy'],['设施所在地','Facility location'],['WRI 历史库 · 12 座设施样本','WRI historical database · 12 facility records']),
 point('compute',['算力设施','Compute facilities'],['设施所在地','Facility location'],['公开科研算力 · 城市参考点','Public research compute · city references']),
 point('news',['新闻与事件','News & events'],['发生所在地','Occurrence location'],['有地点证据的已发布事件','Published events with location evidence']),
 point('meetings',['会议与活动','Conferences & events'],['举办所在地','Host location'],['主办方公开日程 · 城市参考点','Organizer schedules · city references']),
];
export const layerById=Object.fromEntries(layers.map(l=>[l.id,l])) as Record<LayerId,Layer>;
export const groups:{id:string;name:[string,string];icon:string;children:LayerId[];exclusive?:boolean}[]=[
 {id:'developers',name:['开源开发者','Open-source developers'],icon:'people',exclusive:true,children:['developers','contribution','talent']},
 {id:'organizations',name:['开源组织','Open-source organizations'],icon:'organizations',children:['companies','foundations','research']},
 {id:'projects',name:['开源项目','Open-source projects'],icon:'projects',children:['influence','benchmark','emerging','llm']},
 {id:'assets',name:['开源资产','Open assets'],icon:'assets',exclusive:true,children:['code','models','datasets','content']},
 {id:'infrastructure',name:['基础设施','Infrastructure'],icon:'server',children:['energy','compute']},
 {id:'signals',name:['生态动态','Ecosystem signals'],icon:'signal',children:['news','meetings']},
];
export const presets:Record<string,{name:[string,string];layers:LayerId[];primary:LayerId;inspect:LayerId;description:[string,string]}>= {
 overview:{name:['综合观测','Overview'],layers:['developers','companies','benchmark','models','meetings'],primary:'developers',inspect:'developers',description:['参与规模 · 模型供给 · 代表性项目','Participation · model supply · leading projects']},
 developer:{name:['开发者 · 寻找参与机会','Developers · find opportunities'],layers:['influence','code','benchmark','emerging','meetings'],primary:'influence',inspect:'emerging',description:['发现标杆与新项目，寻找参与入口','Discover benchmarks, rising projects and events']},
 enterprise:{name:['企业 · 技术选型与合作','Enterprises · technology & partners'],layers:['influence','models','companies','llm','compute'],primary:'influence',inspect:'llm',description:['对照模型供给、项目与合作方','Compare model supply, projects and partners']},
 researcher:{name:['研究者 · 人才与开放数据','Researchers · talent & data'],layers:['talent','datasets','research','meetings'],primary:'talent',inspect:'datasets',description:['寻找人才、数据资源与科研机构','Explore talent, datasets and institutions']},
 policy:{name:['政策制定者 · 区域生态','Policy · regional ecosystems'],layers:['contribution','models','research','energy','compute'],primary:'contribution',inspect:'contribution',description:['对照区域贡献、资产与基础设施','Regional contribution, assets and infrastructure']},
 foundation:{name:['基金会 · 维护与孵化','Foundations · stewardship'],layers:['influence','code','foundations','benchmark','emerging'],primary:'influence',inspect:'benchmark',description:['发现重点项目与潜在孵化对象','Identify key projects and incubation candidates']},
};
export type Point=Country&{overlayId:LayerId;id?:string;demo?:boolean;entityName?:[string,string];event?:Event;clusterCount?:number;clusterIds?:string[];locationRole?:[string,string];precision?:[string,string];sourceUrls?:string[];metrics?:[string,number|string][];period?:[string,string];note?:[string,string]};
export type Bundle={evidence:any;observation:any;activeDevelopers:any;report:any;located:any;feed:Feed;features:any[];anchors:any[];repoRanking?:any;snapshot?:any;intelligence?:any};
export const isArea=(id:LayerId)=>layerById[id].kind==='area';
export const isBubble=(id:LayerId)=>layerById[id].kind==='bubble';
export const isRegional=(id:LayerId)=>isArea(id)||isBubble(id);
/** Circle AREA, not radius, is proportional to quantity. No minimum visual radius. */
export function bubbleRadius(value:number,max:number,radius=28){return value>0&&max>0?radius*Math.sqrt(value/max):0;}
export function groupState(children:LayerId[],active:LayerId[]){const n=children.filter(c=>active.includes(c)).length;return n===0?'none':n===children.length?'all':'mixed';}
export function toggleLayer(active:LayerId[],id:LayerId){if(active.includes(id))return active.filter(x=>x!==id);const group=groups.find(g=>g.exclusive&&g.children.includes(id));return [...active.filter(x=>!group?.children.includes(x)),id];}
export function toggleGroup(active:LayerId[],children:LayerId[]){if(groups.some(g=>g.exclusive&&g.children.some(c=>children.includes(c))))return active;return groupState(children,active)==='all'?active.filter(x=>!children.includes(x)):[...new Set([...active,...children])];}
export function moveLayer(active:LayerId[],id:LayerId,delta:number){const out=[...active],points=active.filter(k=>!isRegional(k)),at=points.indexOf(id),target=points[at+delta],i=out.indexOf(id),j=out.indexOf(target);if(at>=0&&j>=0)[out[i],out[j]]=[out[j],out[i]];return out;}
export function reconcilePrimary(active:LayerId[],primary:LayerId|null){return primary&&active.includes(primary)&&isArea(primary)?primary:active.find(isArea)??null;}
export function mapSelection(active:LayerId[],primary:LayerId|null,hidden:LayerId[]=[]){return {primary:reconcilePrimary(active,primary),points:active.filter(id=>!isArea(id)&&!hidden.includes(id))};}
export function pointsFor(id:LayerId,b:Bundle):Point[]{
 if(!isRegional(id)){const pts=(b.located.layers[id]??[]).map((p:any)=>({...p,atlasValue:1,overlayId:id}));if(id==='news')pts.push(...b.feed.events.filter(e=>e.provenance!=='demo'&&e.location).map(e=>({id:e.id,country:e.location!.name,countryZh:e.location!.name,rawCode:e.location!.countryCode,longitude:e.location!.lon,latitude:e.location!.lat,atlasValue:1,overlayId:id,event:e})));return pts;}
 const rows=id==='developers'?b.activeDevelopers.rows:b.report.areas[id]?.rows??[];
 return rows.map((r:any)=>({country:r.name,countryZh:r.nameZh,rawCode:r.rawCode??`unmapped:${r.code}`,sourceCode:r.code,longitude:r.longitude,latitude:r.latitude,atlasValue:r.value,overlayId:id}));
}
export function regionsFor(b:Bundle):Country[]{return b.anchors.map(a=>{const d=b.activeDevelopers.rows.find((r:any)=>r.code===a.code);return {country:d?.name??new Intl.DisplayNames(['en'],{type:'region'}).of(a.code)??a.code,countryZh:d?.nameZh??new Intl.DisplayNames(['zh-CN'],{type:'region'}).of(a.code)??a.code,sourceCode:a.code,rawCode:a.rawCode,longitude:a.longitude,latitude:a.latitude,...(d?{atlasValue:d.value}:{})};});}
export const label=(c:Country,l:Lang)=>countryName(c,l);
export function layerTotal(id:LayerId,b:Bundle):number|null{if(id==='developers')return b.activeDevelopers.globalActive;if(isRegional(id))return b.report.areas[id]?.total??null;return pointsFor(id,b).length;}
export function scopedPoints(id:LayerId,b:Bundle,region:string){const points=pointsFor(id,b);return !region?points:points.filter(p=>isRegional(id)?p.rawCode===region:regionMatches(p.rawCode,region));}
export function sourceText(id:LayerId,l:Lang,b?:Bundle){const i=l==='zh'?0:1;if(b?.report.areas[id])return b.report.areas[id].note[i];if(b?.report.catalogs[id])return b.report.catalogs[id].note[i];if(id==='developers')return ['GOSD 2026，GitHub 活跃开发者数，统计期 2025.07.01—2026.06.30。单位：人；与注册开发者总量分别计量。','GOSD 2026: active GitHub developers, July 1, 2025–June 30, 2026. Separate from registered developer totals.'][i];if(id==='news')return ['仅有地点证据的真实事件进入地图；未定位资讯保留在第二屏快讯中。','Only evidenced event locations appear on the map; unlocated news remains in the second-screen wire.'][i];return ['少量有官方地点证据的真实样本，不是全域普查。城市参考点与原始设施坐标分别注明，统计期和位置核验日期分别保留。','Small real sample with official location evidence, not a global census. City references and original facility coordinates are distinguished; measurement and location-verification dates are separate.'][i];}
