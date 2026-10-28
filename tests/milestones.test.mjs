import {test} from 'node:test';
import assert from 'node:assert/strict';
import {milestones,milestoneDate,milestoneTime,promoVideoUrl} from '../src/community/milestones.ts';
test('milestone records are ordered, uniquely addressable and link to repository evidence',()=>{
 assert.equal(new Set(milestones.map(m=>m.id)).size,milestones.length);
 let previous=0;
 for(const m of milestones){assert.match(m.id,/^[a-z][a-z-]+$/);const time=Date.parse(m.at);assert.ok(time>=previous);previous=time;assert.ok(['commit','merge','issue','publication'].includes(m.kind));assert.match(m.path,/^(commit\/[a-f0-9]{40}|pull\/\d+|issues\/\d+|blob\/main\/docs\/releases\/[a-z-]+\.md)$/);assert.ok(m.title.every(Boolean)&&m.summary.every(Boolean));if(m.deployment)assert.ok(Number.isSafeInteger(m.deployment));}
 assert.ok(milestones.some(m=>m.kind==='issue'));assert.ok(milestones.some(m=>m.deployment));
});
test('display dates use a fixed Asia/Shanghai day, independent of browser timezone',()=>{
 assert.equal(milestoneDate('2026-10-27T22:38:53Z'),'2026-10-28');
 assert.equal(milestoneTime('2026-10-27T22:38:53Z'),'06:38');
 assert.equal(milestoneDate('2026-10-24T14:56:14Z'),'2026-10-24');
});

test('publication has a canonical public destination and does not invent a clock time',()=>{
 const release=milestones.find(m=>m.id==='bilibili');assert.equal(release.kind,'publication');assert.equal(release.video,promoVideoUrl);assert.equal(promoVideoUrl,'https://www.bilibili.com/video/BV1J3xL63EPP/');assert.equal(milestoneDate(release.at),'2026-10-28');assert.equal(milestoneTime(release.at),'');assert.match(release.summary[0],/维护者/);
});
