import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const geo=JSON.parse(await readFile(new URL('../public/data/geography.json',import.meta.url),'utf8'));
const world=JSON.parse(await readFile(new URL('../public/data/countries.geojson',import.meta.url),'utf8'));
test('actual map geometries with explicit public-domain attribution',()=>{
 assert.equal(world.type,'FeatureCollection');assert.equal(world.features.length,177);
 for(const f of world.features){assert.ok(['Polygon','MultiPolygon'].includes(f.geometry.type));assert.ok(f.geometry.coordinates.length);assert.ok(f.properties.name);}
 assert.equal(geo.geographySource.license,'Public domain');assert.match(geo.geographySource.licenseUrl,/naturalearthdata.com/);
});
test('static known-country GitHub geography is not monthly or full coverage',()=>{
 assert.equal(geo.semantics.platform,'github');assert.equal(geo.semantics.monthlyTimelineLinked,false);
 assert.equal(geo.semantics.periodStart,null);assert.equal(geo.semantics.periodEnd,null);assert.equal(geo.semantics.unknownCountryCoverage,null);
 assert.equal(geo.semantics.edgeStatus,'unavailable');assert.deepEqual(geo.semantics.edges,[]);
});
test('real label aggregates have provenance and valid non-invented map anchors',()=>{
 assert.ok(geo.layers.length>=2&&geo.layers.length<=4);
 for(const layer of geo.layers){
  assert.match(layer.provenance.sha256,/^[a-f0-9]{64}$/);assert.equal(layer.provenance.httpStatus,200);
  assert.ok(layer.countries.length>0);
  for(const c of layer.countries){
   assert.ok(Number.isFinite(c.developers)&&c.developers>=0);assert.ok(Number.isFinite(c.openrank)&&c.openrank>=0);
   if(c.coordinateStatus==='unmapped'){assert.equal(c.longitude,null);assert.equal(c.latitude,null);}
   else{assert.ok(c.longitude>=-180&&c.longitude<=180);assert.ok(c.latitude>=-90&&c.latitude<=90);assert.match(c.coordinateMethod,/not a person/);}
  }
 }
});
test('Taiwan display grouping retains raw geography code without inventing a contribution total',()=>{
 const tw=world.features.find(f=>f.properties.rawCode==='TWN');assert.ok(tw);assert.equal(tw.properties.displayGroup,'CHN');assert.equal(tw.properties.displayRegionName,'中国台湾');
});
