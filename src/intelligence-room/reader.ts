/** Local reading metadata only. A displayed preview is not automatically marked read. */
export interface ReaderState {read:string[];saved:string[]}
export function normalizeReader(input:unknown):ReaderState {
 const x=input&&typeof input==='object'?input as Record<string,unknown>:{};
 const ids=(v:unknown)=>Array.isArray(v)?[...new Set(v.filter((s):s is string=>typeof s==='string'&&s.length>0&&s.length<=240))].slice(-2000):[];
 return {read:ids(x.read),saved:ids(x.saved)};
}
export function toggleReader(ids:string[],id:string):string[]{return ids.includes(id)?ids.filter(x=>x!==id):[...ids,id].slice(-2000);}
