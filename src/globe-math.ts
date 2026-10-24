export const rad = Math.PI / 180;
export function project(longitude:number,latitude:number,rotation:number,tilt:number){const l=(longitude+rotation)*rad,p=latitude*rad,t=tilt*rad;const x=Math.cos(p)*Math.sin(l),y=Math.sin(p)*Math.cos(t)-Math.cos(p)*Math.cos(l)*Math.sin(t),z=Math.sin(p)*Math.sin(t)+Math.cos(p)*Math.cos(l)*Math.cos(t);return{x,y:-y,z};}
export function calendarWindow(end:string,count:number){const date=new Date(`${end}-01T00:00:00Z`);return Array.from({length:count},(_,i)=>{const d=new Date(date);d.setUTCMonth(d.getUTCMonth()-count+1+i);return d.toISOString().slice(0,7);});}
export function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}
