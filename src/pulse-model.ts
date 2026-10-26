/** Entirely synthetic activity. Never merged with report snapshots or news feeds. */
export type PulseKind='people'|'commits'|'models'|'datasets'|'papers';
export const pulseKinds:PulseKind[]=['people','commits','models','datasets','papers'];
export const pulsePlatforms=['GitHub','GitLab','AtomGit','Gitee','Hugging Face','ModelScope','arXiv'];
export const pulseLabels:Record<PulseKind,[string,string]>={people:['开发者参与','Developer activity'],commits:['代码提交','Code commits'],models:['模型更新','Model activity'],datasets:['数据集更新','Dataset activity'],papers:['研究动态','Research activity']};
const places:[string,string,number,number][]=[['上海','Shanghai',121.47,31.23],['旧金山','San Francisco',-122.42,37.77],['柏林','Berlin',13.41,52.52],['新加坡','Singapore',103.82,1.35],['巴黎','Paris',2.35,48.86],['北京','Beijing',116.40,39.90],['班加罗尔','Bengaluru',77.59,12.97],['东京','Tokyo',139.69,35.68],['圣保罗','São Paulo',-46.63,-23.55],['伦敦','London',-.12,51.51],['深圳','Shenzhen',114.06,22.54],['西雅图','Seattle',-122.33,47.61],['悉尼','Sydney',151.21,-33.87],['内罗毕','Nairobi',36.82,-1.29]];
export type PulseEvent={id:string;synthetic:true;time:number;kind:PulseKind;platform:string;place:[string,string];longitude:number;latitude:number;quantity:number;actors:string[];assets:string[]};
export function eventAt(sequence:number):PulseEvent{
 const platform=pulsePlatforms[sequence%pulsePlatforms.length],wave=Math.floor(sequence/pulsePlatforms.length),p=places[(sequence*5+3)%places.length];
 const kind:PulseKind=platform==='arXiv'?'papers':platform==='Hugging Face'||platform==='ModelScope'?((wave+sequence%pulsePlatforms.length)%2?'models':'datasets'):((wave+sequence%pulsePlatforms.length)%2?'commits':'people');
 const quantity=kind==='people'?1+sequence%7:kind==='commits'?3+(sequence*13)%28:1+(sequence*7)%6;
 return {id:`demo-${sequence}`,synthetic:true,time:sequence*2200,kind,platform,place:[p[0],p[1]],longitude:p[2],latitude:p[3],quantity,actors:Array.from({length:1+sequence%7},(_,i)=>`demo-actor-${(sequence*5+i)%157}`),assets:kind==='models'||kind==='datasets'?Array.from({length:quantity},(_,i)=>`demo-${kind}-${(sequence*3+i)%83}`):[]};
}
export function pulseWindow(clock:number){const latest=Math.floor(clock/2200);return Array.from({length:28},(_,i)=>latest-i).filter(i=>i>=0).map(eventAt).filter(e=>e.time>clock-60000&&e.time<=clock);}
export function pulseTotals(events:PulseEvent[]){return {people:new Set(events.flatMap(e=>e.actors)).size,commits:events.filter(e=>e.kind==='commits').reduce((n,e)=>n+e.quantity,0),models:new Set(events.filter(e=>e.kind==='models').flatMap(e=>e.assets)).size,datasets:new Set(events.filter(e=>e.kind==='datasets').flatMap(e=>e.assets)).size};}
export class PulseClock{clock=66000;paused=false;mapLinked=true;speed=1;advance(ms:number){if(!this.paused)this.clock+=Math.min(Math.max(ms,0),500)*this.speed;}step(){this.clock=(Math.floor(this.clock/2200)+1)*2200;}get events(){return pulseWindow(this.clock);}get totals(){return pulseTotals(this.events);}}
