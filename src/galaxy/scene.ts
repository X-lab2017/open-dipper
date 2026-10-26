import {palettes} from '../design/palette';
import {allowedLink,connectedNodes} from './model';
import type {GalaxyCamera,GalaxyFilter,GalaxyIndex} from './types';

type Options={filter:GalaxyFilter;visible:number[];selected:number;light:boolean;lang:string;camera?:GalaxyCamera;highlights?:number[];path?:{nodes:number[];edges:number[]}|null;motion?:boolean;onSelect:(i:number)=>void;onHover:(i:number,x:number,y:number)=>void;onInteract:()=>void;onCamera:(c:GalaxyCamera)=>void};
type Cloud={x:number;y:number;r:number;color:number;count:number};
// Derive vivid data marks from the shared theme tokens; labels retain the tested
// text palette. This is the RGB equivalent of CSS saturate + brightness.
export function galaxyTone(hex:string,light:boolean){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),luma=rgb[0]*.213+rgb[1]*.715+rgb[2]*.072,saturation=light?2.05:1.65,brightness=light?1:1.12;
 return '#'+rgb.map(v=>Math.round(Math.max(0,Math.min(255,(luma+(v-luma)*saturation)*brightness))).toString(16).padStart(2,'0')).join('');
}
export class GalaxyScene{
 private ctx:CanvasRenderingContext2D;private width=1;private height=1;private dpr=1;private camera:GalaxyCamera;
 private raf=0;private animation=0;private destroyed=false;private resizeObserver:ResizeObserver;
 private sx:Float32Array;private sy:Float32Array;private visibleSet=new Set<number>();private near=new Set<number>();private edgeList:number[]=[];
 private ranked:number[]=[];private palette:string[]=[];private clouds:Cloud[]=[];private backdrop:HTMLCanvasElement;private pointer:{id:number;x:number;y:number;px:number;py:number;moved:boolean}|null=null;
 private fx:HTMLCanvasElement;private fxContext:CanvasRenderingContext2D|null;private fxRaf=0;private fxAt=0;private hovered=-1;
 private abort=new AbortController();private motionPreference=matchMedia('(prefers-reduced-motion: reduce)');private reduced=this.motionPreference.matches;
 private fxLinks:Array<{source:number;target:number}>=[];
 private opts:Options;private fitScale=1;private selectedAt=0;
 constructor(private canvas:HTMLCanvasElement,private index:GalaxyIndex,options:Options){
  const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Canvas unavailable');this.ctx=context;this.opts=options;this.camera=options.camera??{x:0,y:0,zoom:1};
  this.fx=document.createElement('canvas');this.fx.className='galaxy-fx';this.fx.setAttribute('aria-hidden','true');canvas.insertAdjacentElement('afterend',this.fx);this.fxContext=this.fx.getContext('2d');
  this.sx=new Float32Array(index.nodes.length);this.sy=new Float32Array(index.nodes.length);this.backdrop=document.createElement('canvas');
  this.makeClouds();this.update(options);this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.bind();this.resize();
 }
 private colors(){const p=palettes[this.opts.light?'light':'dark'];this.palette=[p.accent,p['event-release'],p.warning,p.positive,p['event-community'],p['event-research'],p.manual,p['chart-influence']].map(color=>galaxyTone(color,this.opts.light));
  // Keep list markers and the canvas synchronized without editing generated tokens.
  const page=this.canvas.closest<HTMLElement>('.galaxy-page');this.palette.forEach((color,i)=>page?.style.setProperty(`--galaxy-c${i}`,color));return p;
 }
 private makeClouds(){const groups=new Map<string,number[]>();this.index.nodes.forEach((n,i)=>{const k=`${n.source}:${n.community}`;if(!groups.has(k))groups.set(k,[]);groups.get(k)!.push(i);});this.clouds=[...groups.values()].filter(a=>a.length>45).sort((a,b)=>b.length-a.length).slice(0,48).map(ids=>{let x=0,y=0;for(const i of ids){x+=this.index.nodes[i].gx;y+=this.index.nodes[i].gy;}x/=ids.length;y/=ids.length;let spread=0;for(const i of ids){const n=this.index.nodes[i];spread+=(n.gx-x)**2+(n.gy-y)**2;}return{x,y,r:Math.max(.022,Math.sqrt(spread/ids.length)*1.6),color:this.index.nodes[ids[0]].colorIndex,count:ids.length};});}
 update(options:Partial<Options>){this.opts={...this.opts,...options};this.colors();this.visibleSet=new Set(this.opts.visible);this.ranked=[...this.opts.visible].sort((a,b)=>this.index.nodes[b].score-this.index.nodes[a].score);this.near=new Set();if(this.opts.selected>=0){this.near.add(this.opts.selected);for(const x of connectedNodes(this.index,this.opts.selected,this.opts.filter))this.near.add(x.node);}
  this.edgeList=[];for(let i=0;i<this.index.edges.length;i++){const e=this.index.edges[i];if(allowedLink(e,this.opts.filter)&&this.visibleSet.has(e.source)&&this.visibleSet.has(e.target))this.edgeList.push(i);}
  this.fxLinks=this.opts.path?this.opts.path.edges.slice(0,3).map(i=>this.index.edges[i]).filter(e=>!e.inferred&&this.visibleSet.has(e.source)&&this.visibleSet.has(e.target)):this.opts.selected>=0?connectedNodes(this.index,this.opts.selected,{...this.opts.filter,inferred:false}).filter(x=>this.visibleSet.has(x.node)).slice(0,18).map(x=>({source:this.opts.selected,target:x.node})):[];
  if(this.opts.motion===false){cancelAnimationFrame(this.animation);this.animation=0;}
  this.canvas.dataset.nodes=String(this.opts.visible.length);this.canvas.dataset.edges=String(this.edgeList.length);this.selectedAt=performance.now();this.request();this.startFx();
 }
 private resize(){const rect=this.canvas.getBoundingClientRect();this.width=Math.max(1,rect.width);this.height=Math.max(1,rect.height);this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);this.fx.width=this.canvas.width;this.fx.height=this.canvas.height;this.fitScale=Math.min(this.width/2.75,this.height/1.6);this.request();this.startFx();}
 getCamera(){return {...this.camera};}
 private screen(x:number,y:number){return{x:(x-this.camera.x)*this.fitScale*this.camera.zoom+this.width/2,y:(y-this.camera.y)*this.fitScale*this.camera.zoom+this.height/2};}
 focus(ids:number[],animated=true){if(!ids.length)return;let x=0,y=0,minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(const i of ids){const n=this.index.nodes[i];x+=n.gx;y+=n.gy;minX=Math.min(minX,n.gx);maxX=Math.max(maxX,n.gx);minY=Math.min(minY,n.gy);maxY=Math.max(maxY,n.gy);}x/=ids.length;y/=ids.length;
  const span=Math.max(maxX-minX,maxY-minY,.09),zoom=ids.length===1?5.4:Math.min(6.5,Math.min(this.width,this.height)*.7/(span*this.fitScale));this.move({x:ids.length===1?x:(minX+maxX)/2,y:ids.length===1?y:(minY+maxY)/2,zoom:Math.max(1,zoom)},animated);
 }
 fit(){const mode=this.opts.filter.mode;if(mode==='all')this.move({x:0,y:0,zoom:1},true);else this.focus(this.opts.visible,true);}
 zoom(factor:number){this.move({...this.camera,zoom:Math.max(.65,Math.min(18,this.camera.zoom*factor))},true);}
 private move(target:GalaxyCamera,animated:boolean){cancelAnimationFrame(this.animation);if(this.reduced||this.opts.motion===false||!animated){this.camera=target;this.changed();return;}const from={...this.camera},start=performance.now();const frame=(now:number)=>{if(this.destroyed)return;const t=Math.min(1,(now-start)/680),e=1-(1-t)**3;this.camera={x:from.x+(target.x-from.x)*e,y:from.y+(target.y-from.y)*e,zoom:from.zoom+(target.zoom-from.zoom)*e};this.changed();if(t<1)this.animation=requestAnimationFrame(frame);else this.animation=0;};this.animation=requestAnimationFrame(frame);}
 private changed(){this.opts.onCamera({...this.camera});this.request();}
 private request(){if(this.destroyed||this.raf)return;this.raf=requestAnimationFrame(()=>{this.raf=0;this.draw();});}
 private draw(){
  const c=this.ctx,p=this.colors(),light=this.opts.light,w=this.width,h=this.height,scale=this.fitScale*this.camera.zoom;
  c.setTransform(this.dpr,0,0,this.dpr,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=p['surface-page'];c.fillRect(0,0,w,h);
  // The nebula follows actual community density; it contains no synthetic entities.
  const galaxyShade=(cx:number,cy:number,r:number,color:string)=>{const pt=this.screen(cx,cy),gr=c.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,r*scale);gr.addColorStop(0,`${color}${light?'16':'20'}`);gr.addColorStop(1,`${color}00`);c.fillStyle=gr;c.fillRect(pt.x-r*scale,pt.y-r*scale,2*r*scale,2*r*scale);};
  if(this.opts.filter.mode!=='model')galaxyShade(-.64,0,.64,this.palette[0]);if(this.opts.filter.mode!=='code')galaxyShade(.64,0,.6,this.palette[2]);
  const focused=this.opts.selected>=0;const baseAlpha=focused?.27:1;
  if(this.camera.zoom<4)for(const cloud of this.clouds){if(this.opts.filter.mode==='code'&&cloud.x>0||this.opts.filter.mode==='model'&&cloud.x<0)continue;const pt=this.screen(cloud.x,cloud.y),r=cloud.r*scale;if(r<2)continue;const grad=c.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,r);grad.addColorStop(0,this.palette[cloud.color]+(light?'20':'30'));grad.addColorStop(.35,this.palette[cloud.color]+(light?'0c':'12'));grad.addColorStop(1,this.palette[cloud.color]+'00');c.fillStyle=grad;c.globalAlpha=baseAlpha;c.fillRect(pt.x-r,pt.y-r,r*2,r*2);}
  c.globalAlpha=1;
  for(let i=0;i<this.index.nodes.length;i++){const n=this.index.nodes[i],pt=this.screen(n.gx,n.gy);this.sx[i]=pt.x;this.sy[i]=pt.y;}
  const moving=!!this.animation||!!this.pointer;const edgeBudget=moving?4200:18000,step=Math.max(1,Math.ceil(this.edgeList.length/edgeBudget));
  c.lineWidth=light?.72:.62;c.strokeStyle=p['map-label'];c.globalAlpha=(light?.22:.23)*(focused?(light?.16:.25):1);c.beginPath();
  for(let j=0;j<this.edgeList.length;j+=step){const e=this.index.edges[this.edgeList[j]];if(e.inferred)continue;const x=this.sx[e.source],y=this.sy[e.source],tx=this.sx[e.target],ty=this.sy[e.target];if(Math.max(x,tx)<0||Math.min(x,tx)>w||Math.max(y,ty)<0||Math.min(y,ty)>h)continue;c.moveTo(x,y);c.lineTo(tx,ty);}c.stroke();
  if(this.opts.filter.inferred){c.strokeStyle=p.warning;c.globalAlpha=light?.13:.1;c.setLineDash([2,5]);c.beginPath();for(let j=0;j<this.edgeList.length;j+=step){const e=this.index.edges[this.edgeList[j]];if(!e.inferred)continue;c.moveTo(this.sx[e.source],this.sy[e.source]);c.lineTo(this.sx[e.target],this.sy[e.target]);}c.stroke();c.setLineDash([]);}
  const pointStep=moving?2:1;for(let k=0;k<8;k++){c.fillStyle=this.palette[k];c.globalAlpha=(light?.83:.88)*baseAlpha;c.beginPath();for(let j=0;j<this.opts.visible.length;j+=pointStep){const i=this.opts.visible[j],n=this.index.nodes[i],x=this.sx[i],y=this.sy[i];if(n.colorIndex!==k||x<-5||x>w+5||y<-5||y>h+5)continue;const r=(.38+Math.pow(n.score,n.source==='model'?9:5)*3.4)*Math.min(1.8,Math.pow(this.camera.zoom,.18));c.moveTo(x+r,y);c.arc(x,y,r,0,Math.PI*2);}c.fill();}
  c.globalAlpha=1;
  if(focused){for(const item of connectedNodes(this.index,this.opts.selected,this.opts.filter).slice(0,260)){const e=item.edge,s=this.opts.selected,t=item.node;if(!this.visibleSet.has(t))continue;c.strokeStyle=e.inferred?this.palette[2]:this.palette[0];c.globalAlpha=e.inferred?.36:light?.78:.72;c.lineWidth=e.inferred?.75:light?1.15:1;c.setLineDash(e.inferred?[3,5]:[]);c.beginPath();c.moveTo(this.sx[s],this.sy[s]);c.lineTo(this.sx[t],this.sy[t]);c.stroke();}c.setLineDash([]);
   for(const i of this.near){if(!this.visibleSet.has(i))continue;const n=this.index.nodes[i],r=i===this.opts.selected?6.5:2.1+this.index.nodes[i].score*.9,x=this.sx[i],y=this.sy[i];c.globalAlpha=1;c.fillStyle=this.palette[n.colorIndex];c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();if(i===this.opts.selected){c.strokeStyle=p['text'];c.lineWidth=1.2;c.beginPath();c.arc(x,y,r+6,0,Math.PI*2);c.stroke();}}
  }
  // Label only landmarks in the current viewport; density stays readable at overview scale.
  this.drawScope(c,p);this.drawLandmarks(c,p);
  const pathNodes=new Set(this.opts.path?.nodes??[]);
  const order=this.opts.path?[...this.opts.path.nodes,...this.ranked.filter(i=>!pathNodes.has(i))]:focused?[this.opts.selected,...this.ranked.filter(i=>i!==this.opts.selected&&this.near.has(i))]:this.ranked;const candidates=order.filter(i=>this.sx[i]>75&&this.sx[i]<w-75&&this.sy[i]>52&&this.sy[i]<h-48);
  const boxes:Array<{x:number;y:number;w:number;h:number}>=[];c.font='12px Inter, system-ui, sans-serif';
  for(const i of candidates){if(boxes.length>=(moving?4:focused?13:this.camera.zoom>2?18:12))break;const n=this.index.nodes[i];if(focused&&!this.near.has(i)&&!pathNodes.has(i))continue;const label=n.name.split('/').at(-1)!.slice(0,27),tw=c.measureText(label).width,x=this.sx[i]+8,y=this.sy[i]-7,box={x:x-3,y:y-13,w:tw+7,h:18};if(box.x+box.w>w-12||boxes.some(b=>box.x<b.x+b.w+12&&box.x+box.w>b.x-12&&box.y<b.y+b.h+8&&box.y+box.h>b.y-8))continue;boxes.push(box);c.globalAlpha=light?.92:.86;c.fillStyle=p['surface-page'];c.fillRect(box.x,box.y,box.w,box.h);c.globalAlpha=1;c.fillStyle=i===this.opts.selected?p.text:p['text-secondary'];c.fillText(label,x,y);}
  if(this.opts.filter.mode==='all'&&this.camera.zoom<1.4&&!focused){c.textAlign='center';c.font='11px Inter, system-ui, sans-serif';c.fillStyle=p['text-muted'];for(const [x,name] of [[-.64,'OPEN GALAXY'],[.64,'MODEL GALAXY']] as const){const pt=this.screen(x,-.65);c.fillText(name,pt.x,Math.max(25,pt.y));}c.textAlign='left';}
  c.globalAlpha=1;this.drawFx(performance.now());
 }
 private drawScope(c:CanvasRenderingContext2D,p:Record<string,string>){
  const w=this.width,h=this.height,single=this.opts.filter.mode!=='all'||this.camera.zoom>1.4;
  const scopes=single?[{x:w/2,y:h/2,r:Math.min(w-90,h-90)/2}]:[-.64,.64].map(x=>({...this.screen(x,0),r:.61*this.fitScale*this.camera.zoom}));
  c.save();c.strokeStyle=p['text-muted'];c.lineWidth=.65;c.globalAlpha=this.opts.light?.32:.28;
  for(const q of scopes){c.beginPath();c.arc(q.x,q.y,q.r,0,Math.PI*2);c.stroke();for(let a=0;a<64;a++){const angle=a*Math.PI/32,r=q.r,len=a%8===0?9:3;c.beginPath();c.moveTo(q.x+Math.cos(angle)*r,q.y+Math.sin(angle)*r);c.lineTo(q.x+Math.cos(angle)*(r-len),q.y+Math.sin(angle)*(r-len));c.stroke();}}
  const m=13,z=12;for(const [x,y,dx,dy] of [[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]]){c.beginPath();c.moveTo(x+dx*z,y);c.lineTo(x,y);c.lineTo(x,y+dy*z);c.stroke();}c.restore();
 }
 private drawLandmarks(c:CanvasRenderingContext2D,p:Record<string,string>){
  const ids=this.opts.highlights?.length?this.opts.highlights.slice(0,50):this.ranked.slice(0,this.opts.selected>=0?0:40),light=this.opts.light;
  c.save();for(const i of ids){const n=this.index.nodes[i],x=this.sx[i],y=this.sy[i];if(x<0||x>this.width||y<0||y>this.height)continue;const r=2.6+n.score*2.2,color=this.palette[n.colorIndex];
   const glow=c.createRadialGradient(x,y,r,x,y,r+14);glow.addColorStop(0,color+(light?'55':'80'));glow.addColorStop(.4,color+(light?'1c':'36'));glow.addColorStop(1,color+'00');c.fillStyle=glow;c.beginPath();c.arc(x,y,r+14,0,Math.PI*2);c.fill();
   c.fillStyle=color;c.globalAlpha=light?.92:.8;c.strokeStyle=color;c.lineWidth=light?1.2:.85;c.beginPath();c.arc(x,y,r+3,0,Math.PI*2);c.stroke();c.globalAlpha=1;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
   c.fillStyle=light?p['surface-panel']:p.text;c.beginPath();c.arc(x,y,Math.max(.8,r*.23),0,Math.PI*2);c.fill();
  }c.restore();
  const path=this.opts.path;if(path){c.save();c.strokeStyle=this.palette[2];c.lineWidth=2.3;c.globalAlpha=.95;for(const ei of path.edges){const e=this.index.edges[ei];c.beginPath();c.moveTo(this.sx[e.source],this.sy[e.source]);c.lineTo(this.sx[e.target],this.sy[e.target]);c.stroke();}for(const i of path.nodes){c.fillStyle=this.palette[2];c.beginPath();c.arc(this.sx[i],this.sy[i],6,0,Math.PI*2);c.fill();}c.restore();}
 }
 private startFx(){cancelAnimationFrame(this.fxRaf);this.fxRaf=0;this.drawFx(performance.now());
  // Expose the applied renderer state, not merely the requested media preference.
  this.fx.dataset.motionState=this.destroyed?'disposed':document.hidden?'hidden':this.reduced?'reduced':!this.opts.motion?'paused':!this.opts.visible.length?'empty':'running';
  if(this.fx.dataset.motionState!=='running')return;
  // Animate only the bounded overlay, never redraw the 43k-node base per frame.
  const tick=(now:number)=>{if(this.destroyed||document.hidden)return;if(now-this.fxAt>32){this.fxAt=now;this.drawFx(now);}this.fxRaf=requestAnimationFrame(tick);};this.fxRaf=requestAnimationFrame(tick);
 }
 private drawFx(now:number){const c=this.fxContext;if(!c)return;const p=palettes[this.opts.light?'light':'dark'],light=this.opts.light;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.width,this.height);
  const animated=!!this.opts.motion&&!this.reduced&&!document.hidden,phase=animated?(now%3200)/3200:0,accent=this.palette[0];
  c.save();
  // Rotating scope arcs and breathing existing landmarks are decorative guides,
  // not events, additional entities, temporal observations or directional edges.
  if(this.opts.selected<0&&!this.opts.path&&this.opts.visible.length){
   const single=this.opts.filter.mode!=='all'||this.camera.zoom>1.4;
   const scopes=single?[{x:this.width/2,y:this.height/2,r:Math.max(1,Math.min(this.width-90,this.height-90)/2)}]:[-.64,.64].map(x=>({...this.screen(x,0),r:.61*this.fitScale*this.camera.zoom}));
   scopes.forEach((q,j)=>{const spin=animated?now/15000*(j?-.8:1):.3;c.strokeStyle=this.palette[j?2:0];c.lineWidth=light?2.1:1.7;c.globalAlpha=light?.56:.64;c.shadowColor=c.strokeStyle;c.shadowBlur=light?0:10;for(let k=0;k<3;k++){const a=spin+k*Math.PI*2/3;c.beginPath();c.arc(q.x,q.y,q.r+2,a,a+.34);c.stroke();}c.shadowBlur=0;});
   const landmarks=(this.opts.highlights?.length?this.opts.highlights:this.ranked).slice(0,24);
   landmarks.forEach((i,j)=>{const x=this.sx[i],y=this.sy[i];if(x<0||x>this.width||y<0||y>this.height)return;const color=this.palette[this.index.nodes[i].colorIndex],breathe=animated?(Math.sin(now/1050+j*1.7)+1)/2:.45,r=8+breathe*5;
    c.strokeStyle=color;c.lineWidth=light?1.2:1;c.globalAlpha=(light?.3:.4)+breathe*.24;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();
   });
  }
  for(const i of new Set([this.opts.selected,this.hovered].filter(i=>i>=0))){if(!this.visibleSet.has(i))continue;const x=this.sx[i],y=this.sy[i];c.strokeStyle=accent;c.lineWidth=light?1.8:1.4;c.globalAlpha=.95;c.shadowColor=accent;c.shadowBlur=light?0:12;c.beginPath();c.arc(x,y,12,0,Math.PI*2);c.stroke();c.shadowBlur=0;
   if(i===this.opts.selected){c.globalAlpha=animated?.7*(1-phase):.45;c.lineWidth=light?2:1.5;c.beginPath();c.arc(x,y,17+phase*25,0,Math.PI*2);c.stroke();c.globalAlpha=.85;c.lineWidth=1.4;c.beginPath();c.moveTo(x-25,y);c.lineTo(x-17,y);c.moveTo(x+17,y);c.lineTo(x+25,y);c.moveTo(x,y-25);c.lineTo(x,y-17);c.moveTo(x,y+17);c.lineTo(x,y+25);c.stroke();}
  }
  if(animated){c.lineCap='round';this.fxLinks.forEach((edge,j)=>{const u=((now/3600+j*.13)%2),t=u<1?u:2-u,tail=Math.max(0,Math.min(1,t+(u<1?-.065:.065))),sx=this.sx[edge.source],sy=this.sy[edge.source],dx=this.sx[edge.target]-sx,dy=this.sy[edge.target]-sy,color=this.opts.path?this.palette[2]:accent;
    // The particle reverses on the same recorded edge: it asserts no direction.
    c.strokeStyle=color;c.fillStyle=color;c.globalAlpha=.45;c.lineWidth=light?2.6:2.1;c.beginPath();c.moveTo(sx+dx*tail,sy+dy*tail);c.lineTo(sx+dx*t,sy+dy*t);c.stroke();c.globalAlpha=1;c.shadowColor=color;c.shadowBlur=light?0:9;c.beginPath();c.arc(sx+dx*t,sy+dy*t,light?2.4:2.2,0,Math.PI*2);c.fill();c.shadowBlur=0;
   });}
  c.restore();
 }
 private nearest(x:number,y:number){let best=-1,d=matchMedia('(pointer: coarse)').matches?24:12;for(const i of this.opts.visible){const dist=Math.hypot(this.sx[i]-x,this.sy[i]-y);if(dist<d){d=dist;best=i;}}return best;}
 private bind(){const sig={signal:this.abort.signal};
  this.canvas.addEventListener('pointerdown',e=>{this.opts.onInteract();cancelAnimationFrame(this.animation);this.animation=0;this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY,moved:false};this.canvas.setPointerCapture(e.pointerId);this.canvas.classList.add('is-dragging');},sig);
  this.canvas.addEventListener('pointermove',e=>{const r=this.canvas.getBoundingClientRect();if(this.pointer){const dx=e.clientX-this.pointer.px,dy=e.clientY-this.pointer.py;this.pointer.moved ||=Math.hypot(e.clientX-this.pointer.x,e.clientY-this.pointer.y)>5;this.pointer.px=e.clientX;this.pointer.py=e.clientY;this.camera.x-=dx/(this.fitScale*this.camera.zoom);this.camera.y-=dy/(this.fitScale*this.camera.zoom);this.changed();return;}const x=e.clientX-r.left,y=e.clientY-r.top,i=this.nearest(x,y);if(this.hovered!==i){this.hovered=i;this.drawFx(performance.now());}this.opts.onHover(i,x,y);},sig);
  const up=(e:PointerEvent)=>{if(!this.pointer)return;const click=!this.pointer.moved;this.pointer=null;this.canvas.classList.remove('is-dragging');if(this.canvas.hasPointerCapture(e.pointerId))this.canvas.releasePointerCapture(e.pointerId);if(click&&e.type!=='pointercancel'){const r=this.canvas.getBoundingClientRect(),i=this.nearest(e.clientX-r.left,e.clientY-r.top);if(i>=0)this.opts.onSelect(i);}this.request();};this.canvas.addEventListener('pointerup',up,sig);this.canvas.addEventListener('pointercancel',up,sig);
  this.canvas.addEventListener('pointerleave',()=>{this.hovered=-1;this.drawFx(performance.now());this.opts.onHover(-1,0,0);},sig);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.animation);this.animation=0;}this.startFx();},sig);
  this.motionPreference.addEventListener('change',e=>{this.reduced=e.matches;if(this.reduced){cancelAnimationFrame(this.animation);this.animation=0;}this.startFx();},sig);
  this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.opts.onInteract();cancelAnimationFrame(this.animation);this.animation=0;const r=this.canvas.getBoundingClientRect(),px=e.clientX-r.left-this.width/2,py=e.clientY-r.top-this.height/2,wx=this.camera.x+px/(this.fitScale*this.camera.zoom),wy=this.camera.y+py/(this.fitScale*this.camera.zoom);this.camera.zoom=Math.max(.65,Math.min(18,this.camera.zoom*Math.exp(-e.deltaY*.0013)));this.camera.x=wx-px/(this.fitScale*this.camera.zoom);this.camera.y=wy-py/(this.fitScale*this.camera.zoom);this.changed();},{...sig,passive:false});
  this.canvas.addEventListener('dblclick',e=>{const r=this.canvas.getBoundingClientRect(),i=this.nearest(e.clientX-r.left,e.clientY-r.top);if(i>=0)this.focus([i]);},sig);
  this.canvas.addEventListener('keydown',e=>{if(!['+','=','-','Home','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();this.opts.onInteract();if(e.key==='Home')this.fit();else if(['+','=','-'].includes(e.key))this.zoom(e.key==='-'?.8:1.25);else{const step=.14/this.camera.zoom;this.camera.x+=e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0;this.camera.y+=e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0;this.changed();}},sig);
 }
 destroy(){this.destroyed=true;cancelAnimationFrame(this.raf);cancelAnimationFrame(this.animation);cancelAnimationFrame(this.fxRaf);this.fx.remove();this.abort.abort();this.resizeObserver.disconnect();}
}
