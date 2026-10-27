import type {Material} from './model';
export const formOrder=['data','paper','news','blog','social','video','conference','event'];
export const topicOrder=['agents','models','infra','security','governance','ecosystem'];
export const visualDay=(m:Material)=>(m.kind==='data'?m.captured:m.date).slice(0,10);
export const primaryTopic=(m:Material)=>topicOrder.find(t=>m.topics?.includes(t))||'ecosystem';
const dayMs=86400000;
export type Cell={key:string;row:number;column:number;from:string;to:string;items:Material[]};
export function visualWindow(items:Material[],range:'month'|'all'){
 const dates=items.map(visualDay).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))).sort();
 const end=dates.at(-1)||'';const endMs=Date.parse(end);const start=end?(range==='all'?dates[0]:new Date(endMs-29*dayMs).toISOString().slice(0,10)):'';
 return {start,end,items:items.filter(m=>visualDay(m)>=start&&visualDay(m)<=end),outside:items.filter(m=>visualDay(m)<start).length};
}
export function visualCells(items:Material[],mode:'timeline'|'radar',range:'month'|'all'){
 const window=visualWindow(items,range);const columns=mode==='timeline'?14:3;const start=Date.parse(window.start);const span=Math.max(dayMs,Date.parse(window.end)-start+dayMs);const groups=new Map<string,Cell>();
 for(const m of window.items){const row=mode==='timeline'?formOrder.indexOf(m.kind==='community'?'event':m.kind):topicOrder.indexOf(primaryTopic(m));if(row<0)continue;const column=Math.min(columns-1,Math.floor((Date.parse(visualDay(m))-start)/span*columns));const key=`${mode}:${row}:${column}`;let cell=groups.get(key);if(!cell){cell={key,row,column,from:new Date(start+Math.ceil(column*span/columns/dayMs)*dayMs).toISOString().slice(0,10),to:new Date(Math.min(Date.parse(window.end),start+(Math.ceil((column+1)*span/columns/dayMs)-1)*dayMs)).toISOString().slice(0,10),items:[]};groups.set(key,cell);}cell.items.push(m);}
 return {...window,cells:[...groups.values()],columns};
}
export function tally(items:Material[]){return {source:items.filter(m=>m.provenance!=='demo').length,demo:items.filter(m=>m.provenance==='demo').length,capture:items.filter(m=>m.kind==='data'||m.dateBasis==='captured').length};}
