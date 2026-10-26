import {canvasPalette} from './design/palette';
import {esc,type Lang} from './observatory/model';
import {PulseClock,pulsePlatforms,pulseLabels,type PulseEvent} from './pulse-model';
import {dashboardPulse,dashboardMetricKeys,REFRESH_MS,type DashboardSnapshot,type DashboardMetric} from './dashboard';
export type MapPulse={id:string;longitude:number;latitude:number;color:string;progress:number;label:string};
const clock=new PulseClock();
let motionInitialized=false;
const copy=(lang:Lang,z:string,e:string)=>lang==='zh'?z:e;
const metricColors:Record<DashboardMetric,string>={developers:'var(--od-pulse-people)',git:'var(--od-pulse-commits)',repositories:'var(--od-pulse-models)',intelligence:'var(--od-pulse-datasets)'};
function metricCopies(lang:Lang){const t=(z:string,e:string)=>copy(lang,z,e);return {
 developers:{label:t('活跃开发者','Active developers'),note:t('报告基数 2,890.36 万','Report baseline 28.90M'),tag:t('模拟增长','DEMO GROWTH')},
 git:{label:t('Git 事件','Git events'),note:t('2025 >10亿 → 2026预计140亿','2025 >1B → 2026E 14B'),tag:t('提交推演','SCENARIO')},
 repositories:{label:t('活跃仓库','Active repositories'),note:t('代码基数 · 模型 / 数据模拟','Code baseline · model/data demo'),tag:t('模拟增长','DEMO GROWTH')},
 intelligence:{label:t('实时资讯','Live intelligence'),note:t('多源信息汇入 · 模拟累计','Multi-source ingestion · simulated'),tag:t('模拟','SIMULATED')}
 };}
export function pulseMarkup(lang:Lang,data:DashboardSnapshot){
 const t=(z:string,e:string)=>copy(lang,z,e),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!motionInitialized){clock.paused=reduced;motionInitialized=true;}
 const labels=metricCopies(lang),values=dashboardPulse(data,clock.clock);
 return `<section class="pulse-panel panel" aria-label="${t('全球生态脉动，基数与模拟增量','Global ecosystem pulse, baselines and simulated increments')}">
 <div class="pulse-metrics">${dashboardMetricKeys.map(k=>`<button class="pulse-metric" data-pulse-metric="${k}" style="--pulse-tone:${metricColors[k]}" title="${labels[k].note} · ${t('点击查看基数、预测与演示说明','Inspect baselines, forecast and simulation')}" aria-label="${labels[k].label} · ${labels[k].tag}"><span class="pulse-metric-label">${labels[k].label}<i>${labels[k].tag}</i></span><span class="pulse-value-row"><strong data-pulse-total="${k}">${values[k].value.toLocaleString('en-US')}</strong><svg class="pulse-spark" viewBox="0 0 100 22" aria-hidden="true"><path data-pulse-spark="${k}"/></svg></span></button>`).join('')}</div>
 <div class="pulse-bottom"><div class="pulse-platforms" title="${t('最近 60 秒模拟参与者','Simulated participants, last 60 seconds')}">${pulsePlatforms.map((p,i)=>`<span class="pulse-platform" data-pulse-platform="${p}"><i class="platform-dot platform-${i}"></i><b>${p}</b><span class="platform-meter" aria-hidden="true">${[0,1,2,3,4].map(n=>`<i style="--bar-delay:${n*.17+i*.1}s;--bar-height:${3+((n*7+i*3)%10)}px"></i>`).join('')}</span><em data-platform-count="${p}">0</em></span>`).join('')}</div><div class="pulse-stream-row"><div class="pulse-events" role="group" aria-label="${t('模拟事件流','Simulated event stream')}"></div><div class="pulse-controls"><button data-pulse-help aria-label="${t('动态指标口径与模拟说明','Activity metric scope and simulation')}" title="${t('动态指标口径与模拟说明','Activity metric scope and simulation')}">ⓘ</button><button data-pulse-link aria-label="${t('地图联动','Map pulses')}" aria-pressed="${clock.mapLinked}" title="${t('模拟事件与地图联动','Show simulated events on map')}">⌁</button><button data-pulse-step title="${t('推进一轮模拟更新','Step one simulated update')}">+1</button><button data-pulse-speed aria-label="${t('演示速度','Simulation speed')}">${clock.speed}×</button><button data-pulse-play aria-pressed="${!clock.paused}" aria-label="${t(clock.paused?'播放模拟动态':'暂停模拟动态',clock.paused?'Play simulation':'Pause simulation')}">${clock.paused?'▶':'Ⅱ'}</button></div></div></div><div class="pulse-track" aria-hidden="true"><i></i></div></section>`;
}
export function mountPulse(root:HTMLElement,lang:Lang,data:DashboardSnapshot,onPulses:(p:MapPulse[])=>void,onEvent:(e:PulseEvent)=>void,onHelp:()=>void){
 const palette=canvasPalette(document.documentElement.dataset.theme==='light');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),t=(z:string,e:string)=>copy(lang,z,e);
 let raf=0,last=performance.now(),lastPaint=-1000,lastEvent='',destroyed=false,visible=true;
 const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;});observer.observe(root);
 const sync=()=>{
  root.dataset.paused=String(clock.paused||reduced.matches);root.dataset.mapLinked=String(clock.mapLinked);root.dataset.simulation='true';root.dataset.clock=String(Math.floor(clock.clock));
  const b=root.querySelector<HTMLButtonElement>('[data-pulse-play]')!;b.textContent=clock.paused?'▶':'Ⅱ';b.setAttribute('aria-pressed',String(!clock.paused));b.setAttribute('aria-label',t(clock.paused?'播放模拟动态':'暂停模拟动态',clock.paused?'Play simulation':'Pause simulation'));b.disabled=reduced.matches;b.title=reduced.matches?t('系统已启用减少动态，可用 +1 逐条查看','Reduced motion enabled; use +1 to step'):'';
  root.querySelector('[data-pulse-link]')!.setAttribute('aria-pressed',String(clock.mapLinked));root.querySelector('[data-pulse-speed]')!.textContent=`${clock.speed}×`;root.querySelector<HTMLButtonElement>('[data-pulse-speed]')!.disabled=reduced.matches;
 };
 function update(){
  const events=clock.events,newId=events[0]?.id,values=dashboardPulse(data,clock.clock);
  for(const k of dashboardMetricKeys){
   const el=root.querySelector<HTMLElement>(`[data-pulse-total="${k}"]`)!,value=values[k].value.toLocaleString('en-US');
   el.dataset.base=String(values[k].base);el.dataset.growth=String(values[k].growth);el.dataset.value=String(values[k].value);
   if(el.textContent!==value){el.textContent=value;el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}
   const trend=Array.from({length:15},(_,i)=>dashboardPulse(data,clock.clock-(14-i)*REFRESH_MS)[k].growth),min=Math.min(...trend),range=Math.max(1,Math.max(...trend)-min);
   root.querySelector(`[data-pulse-spark="${k}"]`)!.setAttribute('d',trend.map((v,i)=>`${i?'L':'M'}${i*100/14},${21-(v-min)/range*19}`).join(' '));
  }
  for(const p of pulsePlatforms){const count=new Set(events.filter(e=>e.platform===p).flatMap(e=>e.actors)).size;root.querySelector(`[data-platform-count="${p}"]`)!.textContent=String(count);}
  const holder=root.querySelector<HTMLElement>('.pulse-events')!;
  if(newId!==lastEvent){
   holder.innerHTML=events.slice(0,3).map((e,i)=>`<button class="pulse-event ${!i?'new':''}" data-pulse-event="${e.id}" style="--pulse-tone:var(--od-pulse-${e.kind})" title="${t('模拟事件，点击查看与定位','Simulated event; inspect and locate')}"><span class="pulse-event-dot"></span><b>${esc(e.platform)}</b><strong>${esc(e.place[lang==='zh'?0:1])}</strong><span>${pulseLabels[e.kind][lang==='zh'?0:1]} <em>+${e.quantity}</em></span><time data-pulse-age="${e.id}"></time></button>`).join('');
   holder.querySelectorAll<HTMLElement>('[data-pulse-event]').forEach(el=>el.onclick=()=>{const e=events.find(e=>e.id===el.dataset.pulseEvent);if(e){clock.paused=true;sync();onEvent(e);}});lastEvent=newId;
  }
  for(const e of events.slice(0,3)){const label=root.querySelector(`[data-pulse-age="${e.id}"]`);if(label)label.textContent=`${Math.floor((clock.clock-e.time)/1000).toString().padStart(2,'0')}s`;}
  root.dataset.clock=String(Math.floor(clock.clock));root.dataset.latestEvent=newId;
  onPulses(clock.mapLinked?events.filter(e=>clock.clock-e.time<5200).map(e=>({id:e.id,longitude:e.longitude,latitude:e.latitude,color:palette[`pulse-${e.kind}`],progress:Math.max(0,Math.min(1,(clock.clock-e.time)/5200)),label:`${e.place[lang==='zh'?0:1]} · ${e.platform}`})):[]);
 }
 root.querySelector('[data-pulse-play]')!.addEventListener('click',()=>{clock.paused=!clock.paused;sync();update();});root.querySelector('[data-pulse-link]')!.addEventListener('click',()=>{clock.mapLinked=!clock.mapLinked;sync();update();});root.querySelector('[data-pulse-step]')!.addEventListener('click',()=>{clock.paused=true;clock.step();sync();update();});root.querySelector('[data-pulse-speed]')!.addEventListener('click',()=>{clock.speed=clock.speed===1?2:1;sync();});
 root.querySelectorAll('[data-pulse-help],[data-pulse-metric]').forEach(el=>el.addEventListener('click',()=>{clock.paused=true;sync();onHelp();}));
 const changed=()=>{if(reduced.matches)clock.paused=true;sync();update();};reduced.addEventListener('change',changed);sync();update();
 const frame=(now:number)=>{if(destroyed)return;const dt=Math.min(now-last,100);last=now;if(!document.hidden&&visible){clock.advance(dt);if(now-lastPaint>120){update();lastPaint=now;}}raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
 return ()=>{destroyed=true;cancelAnimationFrame(raf);observer.disconnect();reduced.removeEventListener('change',changed);onPulses([]);};
}
