import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRoom,roomExport,scenarios} from '../src/intelligence-room/model.ts';
test('corrupt local state cannot add arbitrary objects, oversized drafts or invalid execution steps',()=>{
 const state=normalizeRoom({selected:'unknown',tab:'execute',stage:999,draft:'x'.repeat(800),tracked:['inference','inference','unknown',{},null],cadence:'every-second',condition:'execute',feedback:'approved'});
 assert.equal(state.selected,'inference');assert.equal(state.tab,'signals');assert.equal(state.stage,3);assert.equal(state.draft.length,600);assert.deepEqual(state.tracked,['inference']);assert.equal(state.cadence,'weekly');assert.equal(state.feedback,'');assert.equal(normalizeRoom(null).tracked.length,0);
});
test('every scenario export retains fiction, missing evidence and separates custom question from scripted advice',()=>{
 for(const x of scenarios)for(const english of [false,true]){
 const state=normalizeRoom({selected:x.id,draft:'My unexecuted question',tracked:[x.id],feedback:'missing'});const out=roomExport(state,english);
 assert.match(out,/DEMO \/ 2026-10-27/);assert.ok(out.includes(x.gap[english?1:0]));assert.ok(out.includes('My unexecuted question'));assert.ok(out.includes(x.question[english?1:0]));assert.ok(out.includes('missing'));assert.equal(/https?:/.test(out),false);
 }
});
