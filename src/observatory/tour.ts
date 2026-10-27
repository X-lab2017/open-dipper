import type {LayerId} from '../layers';

/** Camera itinerary, not a new data source or a ranking of places. */
export const tourStops: {layer:LayerId;view:'map'|'globe';anchor?:string;note:[string,string]}[] = [
  {layer:'developers',view:'map',note:['从全球地域统计出发，查看活跃开发者分布。','Start with regional observations of active developers worldwide.']},
  {layer:'companies',view:'globe',anchor:'company-Microsoft',note:['转向北美，查看已核验的企业总部；右侧保留全球原表。','Turn toward North America and verified headquarters; the panel keeps the global source table.']},
  {layer:'benchmark',view:'globe',anchor:'benchmark-CANN',note:['转向东亚，查看标杆项目的关联组织；点位不代表全部贡献来源。','Turn toward East Asia and project organizations; points do not represent all contribution origins.']},
  {layer:'models',view:'map',note:['回到全球地图，用气泡面积比较模型发布样本；不是实时新增量。','Return to the world map to compare model publication samples by bubble area, not live growth.']},
  {layer:'meetings',view:'globe',anchor:'kubecon-na-2026',note:['最后查看主办方公开日程与举办城市，保留各活动原始日期。','Finish with organizer schedules and host cities, retaining each event’s original dates.']},
];

type Clock={set:(fn:()=>void,ms:number)=>unknown;clear:(id:unknown)=>void};
/** One finite, opt-in tour. The caller owns workspace snapshots and rendering. */
export class ObservatoryTour {
  index=-1;
  playing=false;
  private timer:unknown;
  constructor(private step:(index:number)=>void,private changed:()=>void,private clock:Clock={set:(fn,ms)=>setTimeout(fn,ms),clear:id=>clearTimeout(id as ReturnType<typeof setTimeout>)}){}
  get active(){return this.index>=0;}
  start(autoplay:boolean){this.cancel();this.index=0;this.playing=autoplay;this.step(0);this.changed();this.schedule();}
  pause(){this.cancel();this.playing=false;this.changed();}
  toggle(){if(!this.active)return;if(this.playing){this.pause();return;}this.playing=true;this.go(this.index===tourStops.length-1?0:this.index);}
  go(index:number){if(!this.active)return;this.cancel();this.index=Math.max(0,Math.min(index,tourStops.length-1));if(this.index===tourStops.length-1)this.playing=false;this.step(this.index);this.changed();this.schedule();}
  stop(){this.cancel();this.index=-1;this.playing=false;this.changed();}
  private cancel(){if(this.timer!==undefined)this.clock.clear(this.timer);this.timer=undefined;}
  private schedule(){this.cancel();if(this.playing&&this.active)this.timer=this.clock.set(()=>{this.timer=undefined;this.go(this.index+1);},10000);}
}
