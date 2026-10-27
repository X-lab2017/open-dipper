/** Pure camera geometry shared by rendering and acceptance tests. */
export type Camera={lon:number;lat:number;zoom:number;pan:number[]};
export const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export const angleDelta=(from:number,to:number)=>((to-from+540)%360+360)%360-180;
export const unitVector=(lon:number,lat:number)=>{const a=lon*Math.PI/180,b=lat*Math.PI/180,c=Math.cos(b);return [c*Math.sin(a),Math.sin(b),c*Math.cos(a)];};
export function rotated(v:number[],lon:number,lat:number){const a=lon*Math.PI/180,b=lat*Math.PI/180,x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=v[2]*Math.cos(a)-v[0]*Math.sin(a);return [x,v[1]*Math.cos(b)-z*Math.sin(b),v[1]*Math.sin(b)+z*Math.cos(b)];}
export function tweenCamera(from:Camera,to:Camera,t:number):Camera{const u=1-(1-clamp(t,0,1))**3;return {lon:from.lon+angleDelta(from.lon,to.lon)*u,lat:from.lat+(to.lat-from.lat)*u,zoom:from.zoom+(to.zoom-from.zoom)*u,pan:from.pan.map((v,i)=>v+(to.pan[i]-v)*u)};}
/** Mercator camera helpers: latitude is bounded before projection. */
export const mercatorY=(lat:number)=>Math.log(Math.tan(Math.PI/4+clamp(lat,-84,84)*Math.PI/360));
export const mercatorLatitude=(y:number)=>Math.atan(Math.sinh(y))*180/Math.PI;
export function zoomMapAt(pan:number[],oldZoom:number,newZoom:number,point:number[],center:number[]){const ratio=newZoom/oldZoom;return pan.map((v,i)=>v*ratio+(point[i]-center[i])*(1-ratio));}

/** Balanced north-up frame of inhabited land (Antarctica remains outside the home extent).
 * lon is the D3 rotation (the negative of geographic center longitude).
 */
export const MAP_EXTENT={north:83,south:-56} as const;
export const MAP_HOME={lon:-5,lat:mercatorLatitude((mercatorY(MAP_EXTENT.north)+mercatorY(MAP_EXTENT.south))/2),zoom:1} as const;
export const GLOBE_HOME={lon:-65,lat:20,zoom:1} as const;
export const mapBaseScale=(width:number,height:number)=>Math.min(width*.92/(2*Math.PI),height*.86/(mercatorY(MAP_EXTENT.north)-mercatorY(MAP_EXTENT.south)));
