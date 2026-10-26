import {ramps,metricRamps,canvasPalette} from './palette';
/** The same explicitly ordered stops drive canvas fills and the HTML legend. */
export const metricRamp=(metric:string,light:boolean):readonly string[]=>ramps[metricRamps[metric]??'blue'][light?'light':'dark'];
export function sampleRamp(stops:readonly string[],position:number){
 const at=Math.max(0,Math.min(1,position))*(stops.length-1),i=Math.min(stops.length-2,Math.floor(at)),t=at-i;
 const rgb=(hex:string)=>[1,3,5].map(x=>parseInt(hex.slice(x,x+2),16));
 const a=rgb(stops[i]),b=rgb(stops[i+1]);
 return '#'+a.map((v,k)=>Math.round(v+(b[k]-v)*t).toString(16).padStart(2,'0')).join('');
}
export const metricFill=(metric:string,light:boolean,value:number|null|undefined,max:number)=>value==null?canvasPalette(light)['map-unobserved']:sampleRamp(metricRamp(metric,light),Math.log1p(Math.max(0,value))/Math.log1p(Math.max(1,max)));
export const legendRamp=(metric:string,light:boolean)=>`linear-gradient(90deg,${metricRamp(metric,light).join(',')})`;
