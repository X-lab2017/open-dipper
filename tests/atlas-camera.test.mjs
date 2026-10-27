import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {geoMercator} from 'd3-geo';
const js=ts.transpileModule(await fs.readFile('src/observatory/globe-math.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {MAP_HOME,MAP_EXTENT,mapBaseScale,mercatorY,mercatorLatitude}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('home framing keeps contiguous US and China visible on a shared horizontal band',()=>{
 for(const [w,h] of [[700,445],[790,630],[1356,756],[1920,1080]]){
  const s=mapBaseScale(w,h),p=geoMercator().rotate([MAP_HOME.lon,0]).scale(s).translate([w/2,h/2+mercatorY(MAP_HOME.lat)*s]);
  const us=p([-98,39]),cn=p([105,35]);
  for(const [x,y] of [us,cn,p([-124,32]),p([-67,49]),p([73,39]),p([135,48])]){assert.ok(x>w*.06&&x<w*.94);assert.ok(y>h*.15&&y<h*.65);}
  assert.ok(us[0]<w/2&&cn[0]>w/2);assert.ok(Math.abs(us[1]-cn[1])<h*.06);
  assert.ok(p([0,50])[1]<p([0,0])[1],'north stays up');
 }
});
test('inhabited-world frame is vertically centered with breathing room at multiple aspect ratios',()=>{
 for(const [w,h] of [[355,420],[797,599],[1060,700],[1920,1080]]){
  const s=mapBaseScale(w,h),y=lat=>h/2+(mercatorY(MAP_HOME.lat)-mercatorY(lat))*s;
  const north=y(MAP_EXTENT.north),south=y(MAP_EXTENT.south);
  assert.ok(north>=h*.069);assert.ok(south<=h*.931);
  assert.ok(Math.abs((north+south)/2-h/2)<1e-9,'north/south margins must be balanced');
 }
});
test('resize restores geographic center without depending on old pixel pan',()=>{
 for(const [w,h] of [[700,445],[1356,756],[1920,1080]]){
  const s=mapBaseScale(w,h),pan=[MAP_HOME.lon*Math.PI/180*s,mercatorY(MAP_HOME.lat)*s];
  assert.ok(Math.abs(pan[0]/s*180/Math.PI-MAP_HOME.lon)<1e-9);
  assert.ok(Math.abs(mercatorLatitude(pan[1]/s)-MAP_HOME.lat)<1e-9);
 }
});
