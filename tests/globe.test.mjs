import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {geoOrthographic} from 'd3-geo';
const source=await fs.readFile(new URL('../src/observatory/globe-math.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {angleDelta,unitVector,rotated,tweenCamera}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('surface points agree with geographic projection at all orientations and poles',()=>{
 for(const lon of [-720,-180,-37,0,180,735])for(const lat of [-80,0,80])for(const p of [[0,0],[105,26],[-70,-40],[180,90],[10,-90]]){
  const v=rotated(unitVector(...p),lon,lat),xy=geoOrthographic().translate([0,0]).scale(1).rotate([lon,-lat])(p);
  near(v[0],xy[0]);near(-v[1],xy[1]);near(Math.hypot(...v),1);assert.ok(v.every(Number.isFinite));
 }
});
test('front-facing point and antipode have opposite visibility at target camera',()=>{
 for(const [lon,lat] of [[105,26],[-95,23],[0,80]]){
  near(rotated(unitVector(lon,lat),-lon,lat)[2],1);
  near(rotated(unitVector(lon+180,-lat),-lon,lat)[2],-1);
 }
});
test('camera flights take the short dateline route, including repeated full turns',()=>{
 near(angleDelta(179,-179),2);near(angleDelta(-179,179),-2);near(angleDelta(899,-179),2);
 const from={lon:179,lat:70,zoom:1,pan:[0,0]},to={lon:-179,lat:-30,zoom:2,pan:[20,-5]};
 assert.deepEqual(tweenCamera(from,to,-1),from);
 const end=tweenCamera(from,to,2);near(angleDelta(end.lon,to.lon),0);near(end.lat,to.lat);near(end.zoom,to.zoom);assert.deepEqual(end.pan,to.pan);
 for(let t=0;t<=1;t+=.05){const c=tweenCamera(from,to,t);assert.ok(c.lon>=179&&c.lon<=181);assert.ok(c.lat>=-30&&c.lat<=70);assert.ok(c.zoom>=1&&c.zoom<=2);}
});

test('Mercator latitude round-trips and cursor-centred zoom keeps the anchor fixed',async()=>{
 const {mercatorY,mercatorLatitude,zoomMapAt}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 for(const lat of [-84,-60,-5,0,18,70,84])near(mercatorLatitude(mercatorY(lat)),lat);
 assert.ok(Number.isFinite(mercatorY(90)));assert.ok(Number.isFinite(mercatorY(-90)));
 const center=[440,260],pan=[-130,57],point=[630,170],oldScale=120,newScale=180;
 const before=[(point[0]-center[0]-pan[0])/oldScale,(center[1]+pan[1]-point[1])/oldScale];
 const after=zoomMapAt(pan,1,1.5,point,center);
 near(center[0]+after[0]+newScale*before[0],point[0]);near(center[1]+after[1]-newScale*before[1],point[1]);
});
