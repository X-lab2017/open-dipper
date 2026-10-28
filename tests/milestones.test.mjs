import {test} from 'node:test';
import assert from 'node:assert/strict';
import {milestones,milestoneDate,milestoneTime} from '../src/community/milestones.ts';
test('milestone records are ordered, uniquely addressable and link to repository evidence',()=>{
 assert.equal(new Set(milestones.map(m=>m.id)).size,milestones.length);
 let previous=0;
 for(const m of milestones){assert.match(m.id,/^[a-z][a-z-]+$/);const time=Date.parse(m.at);assert.ok(time>=previous);previous=time;assert.ok(['commit','merge','issue'].includes(m.kind));assert.match(m.path,/^(commit\/[a-f0-9]{40}|pull\/\d+|issues\/\d+)$/);assert.ok(m.title.every(Boolean)&&m.summary.every(Boolean));if(m.deployment)assert.ok(Number.isSafeInteger(m.deployment));}
 assert.ok(milestones.some(m=>m.kind==='issue'));assert.ok(milestones.some(m=>m.deployment));
});
test('display dates use a fixed Asia/Shanghai day, independent of browser timezone',()=>{
 assert.equal(milestoneDate('2026-10-27T22:38:53Z'),'2026-10-28');
 assert.equal(milestoneTime('2026-10-27T22:38:53Z'),'06:38');
 assert.equal(milestoneDate('2026-10-24T14:56:14Z'),'2026-10-24');
});
