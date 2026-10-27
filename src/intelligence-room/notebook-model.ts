import {caseSteps} from './inference-case.ts';
import type {Material} from './model';
export type NotebookNote={id:string;title:string;body:string;origin:'manual'|'template'|'demo'|'example';sourceIds:string[]};
export type NotebookQuestion={id:string;text:string;sourceIds:string[];createdAt:string};
export type Notebook={id:string;title:string;caseId?:'inference';demo:boolean;sourceIds:string[];excluded:string[];draft:string;questions:NotebookQuestion[];notes:NotebookNote[];activeNote:string};
export type NotebookState={version:1;active:string;books:Notebook[]};
const str=(x:unknown,n:number)=>typeof x==='string'?x.slice(0,n):'';
export const notebookIds=(x:unknown):string[]=>Array.isArray(x)?[...new Set(x.filter((v):v is string=>typeof v==='string'&&/^[\w:.-]{1,160}$/.test(v)))].slice(0,40):[];
const rows=(x:unknown):Record<string,unknown>[]=>Array.isArray(x)?x.filter(v=>v&&typeof v==='object'):[];
export function normalizeNotebooks(x:unknown):NotebookState{
 const v=x&&typeof x==='object'?x as Record<string,unknown>:{};const seen=new Set<string>();
 const books=rows(v.books).filter(b=>typeof b.id==='string'&&/^[\w-]{1,80}$/.test(b.id)&&!seen.has(b.id)&&(seen.add(b.id),true)).slice(0,13).map(b=>{
 const notes=rows(b.notes).filter(n=>typeof n.id==='string'&&/^[\w-]{1,80}$/.test(n.id)).slice(0,30).map(n=>({id:String(n.id),title:str(n.title,120),body:str(n.body,20000),origin:n.origin==='example'?'example':n.origin==='demo'?'demo':n.origin==='template'?'template':'manual',sourceIds:notebookIds(n.sourceIds)} as NotebookNote));
 return {id:String(b.id),...(b.caseId==='inference'?{caseId:'inference' as const}:{}),title:str(b.title,120),demo:b.demo===true,sourceIds:notebookIds(b.sourceIds),excluded:notebookIds(b.excluded),draft:str(b.draft,2000),questions:rows(b.questions).slice(0,40).map(q=>({id:str(q.id,80),text:str(q.text,2000),sourceIds:notebookIds(q.sourceIds),createdAt:str(q.createdAt,40)})),notes,activeNote:notes.some(n=>n.id===b.activeNote)?String(b.activeNote):notes[0]?.id||''};
 });return {version:1,books,active:books.some(b=>b.id===v.active)?String(v.active):books[0]?.id||''};
}
export function contextIds(b:Notebook,items:Material[]):string[]{return b.sourceIds.filter(id=>!b.excluded.includes(id)&&items.some(m=>m.id===id&&(b.demo||m.provenance!=='demo')));}
export function notebookBundle(b:Notebook,items:Material[],english=false){
 const i=english?1:0;const ids=[...new Set([...b.sourceIds,...b.questions.flatMap(q=>q.sourceIds),...b.notes.flatMap(n=>n.sourceIds),...(b.caseId==='inference'?caseSteps.flatMap(s=>s.sourceIds):[])])];
 return {schemaVersion:1,kind:'opendipper-research-notebook',execution:'not-connected',...(b.caseId==='inference'?{editorialWalkthrough:caseSteps.map(s=>({question:s.question[i],answer:s.answer[i],next:s.next[i],sourceIds:s.sourceIds}))}:{}),notebook:b,sources:ids.map(id=>{const m=items.find(m=>m.id===id);return m?{id,title:m.title[i],excerpt:m.summary[i],url:/^https?:\/\//i.test(m.url)?m.url:'',provenance:m.provenance,publishedOrSnapshotDate:m.date,dateBasis:m.dateBasis||'published',captured:m.captured,observationPeriod:m.period?.[i]||null,source:m.source}:{id,status:'unavailable'};})};
}
export function notebookMarkdown(b:Notebook,items:Material[],english=false):string{
 const i=english?1:0;const bundle=notebookBundle(b,items,english);return [`# ${b.title}`,english?'LOCAL PRODUCT PROTOTYPE — questions not executed; notes are manual or templates.':'本机产品原型 — 问题未执行；笔记为手写或模板。',b.caseId==='inference'?(english?'EDITORIAL EXAMPLE — real sources, unexecuted analysis and trial plan.':'编辑示例 — 真实来源，非实时 AI 回答；试验未执行。'):'',...(b.caseId==='inference'?caseSteps.map(s=>`### ${s.question[i]}\n\n${s.answer[i]}\n\n${s.next[i]}\nSources: ${s.sourceIds.join(', ')}`):[]),b.demo?'DEMO — fictional walkthrough / 虚构流程演示':'',`## ${english?'Questions · not executed':'问题 · 未执行'}`,...b.questions.map(q=>`${q.text}\n\nContext: ${q.sourceIds.join(', ')||'—'}`),`## ${english?'Notes':'笔记'}`,...b.notes.map(n=>`### ${n.title}\n\n[${n.origin}]\n\n${n.body}\n\nSources: ${n.sourceIds.join(', ')||'—'}`),`## ${english?'Sources':'资料来源'}`,...bundle.sources.map(s=>'status'in s?`${s.id}: unavailable / 不可用`:`- ${s.title} [${s.provenance}]\n  ${s.url||'DEMO / no URL'}\n  ${s.dateBasis}: ${s.publishedOrSnapshotDate}; captured: ${s.captured}\n  ${s.observationPeriod||''}\n  ${s.excerpt}`)].filter(Boolean).join('\n\n');
}
