import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const tokens=JSON.parse(await fs.readFile('design/tokens.json','utf8'));
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
test('official X-lab SVGs exactly match pinned upstream blobs',async()=>{
 const provenance=JSON.parse(await fs.readFile('public/brand/provenance.json','utf8'));
 for(const asset of provenance.assets){const bytes=await fs.readFile(`public/brand/${asset.file}`);const hash=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');assert.equal(hash,asset.gitBlobSha,asset.file);}
});
test('normal text and event labels meet 4.5:1 against panel surfaces in both themes',()=>{
 for(const [theme,p]of Object.entries(tokens.themes))for(const key of ['text','text-secondary','text-muted','accent','info','warning','critical','manual',...Object.keys(p).filter(k=>k.startsWith('event-'))])assert.ok(contrast(p[key],p['surface-panel'])>=4.5,`${theme}:${key}`);
});
test('source badges and primary actions preserve text contrast',()=>{
 for(const [theme,p]of Object.entries(tokens.themes)){
  for(const [fg,bg]of [['accent','accent-soft'],['info','info-soft'],['warning','warning-soft'],['critical','critical-soft'],['manual','manual-soft']])assert.ok(contrast(p[fg],p[bg])>=4.5,`${theme}:${fg}`);
  assert.ok(contrast(p['text-inverse'],tokens.brand.green)>=4.5,`${theme}:primary`);
 }
});
test('both themes expose identical keys and map/chart colors are usable by Canvas',()=>{
 assert.deepEqual(Object.keys(tokens.themes.dark).sort(),Object.keys(tokens.themes.light).sort());
 for(const p of Object.values(tokens.themes))for(const v of Object.values(p))assert.match(v,/^#[\da-f]{6}$/i);
 for(const key of ['activity','change_requests_accepted','openrank'])assert.ok(Number.isFinite(tokens.metricHues[key]));
});
