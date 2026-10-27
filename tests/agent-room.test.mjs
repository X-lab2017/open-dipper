import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRoom,filterMaterials,demoMaterials,roomExport} from '../src/intelligence-room/model.ts';
test('bounded local state rejects malformed tasks and intervals',()=>{const s=normalizeRoom({from:28,to:-1,selected:['<script>','aurora-release','aurora-release'],draft:'x'.repeat(900),researches:[null,{id:'bad<>',question:'x'}]});assert.equal(s.from,27);assert.equal(s.to,27);assert.equal(s.draft.length,600);assert.deepEqual(s.selected,['aurora-release']);assert.deepEqual(s.researches,[]);});
test('as-known date excludes later captures and never invents daily snapshots',()=>{const data={...demoMaterials[0],id:'actual',kind:'data',provenance:'snapshot',date:'2026-10-08',captured:'2026-10-26'};assert.equal(filterMaterials([data],normalizeRoom({archive:false,mode:'asof',to:15})).length,0);assert.equal(filterMaterials([data],normalizeRoom({archive:false,from:27,to:27})).length,1);assert.equal(filterMaterials(demoMaterials,normalizeRoom({demo:false})).length,0);});
test('date ranges and searches intersect; export keeps provenance and missing sources',()=>{const s=normalizeRoom({archive:false,from:15,to:25,query:'Aurora',kind:'paper'});assert.deepEqual(filterMaterials(demoMaterials,s).map(x=>x.id),['aurora-benchmark']);const state=normalizeRoom({draft:'My real question',selected:['aurora-release','missing']});const out=roomExport(state,demoMaterials,true);assert.match(out,/DEMO/);assert.match(out,/My real question/);assert.match(out,/not an answer/);assert.match(out,/missing: unavailable/);});

import fs from 'node:fs';
import {validateCatalog} from '../src/intelligence-room/catalog.ts';
const catalog=JSON.parse(fs.readFileSync('public/data/intelligence-catalog.json','utf8'));
test('catalog has bounded source records and resolvable evidence relationships',()=>{assert.ok(validateCatalog(catalog).records.length>300);for(const kind of ['data','paper','blog','social','video','conference','event'])assert.ok(catalog.records.some(r=>r.kind===kind));const bad=structuredClone(catalog);bad.links[0].to='missing';assert.throws(()=>validateCatalog(bad));const unsafe=structuredClone(catalog);unsafe.records[0].url='javascript:alert(1)';assert.throws(()=>validateCatalog(unsafe));const duplicate=structuredClone(catalog);duplicate.records.push(duplicate.records[0]);assert.throws(()=>validateCatalog(duplicate));});
test('archive, topic, entity and explicit date filters preserve source scope',()=>{const state=normalizeRoom({kind:'paper',topic:'agents',archive:true,endDate:'2023-12-31'});const rows=filterMaterials(catalog.records,state);assert.ok(rows.length>=2);assert.ok(rows.every(r=>r.kind==='paper'&&r.date<='2023-12-31'));const e=catalog.entities[0];assert.ok(filterMaterials(catalog.records,normalizeRoom({entity:e.url})).every(r=>r.entityUrls.includes(e.url)));const draft=normalizeRoom({researches:[{id:'r',question:'q',scope:'2022-01-01 — 2026-10-27',materialIds:[],tracked:false}],active:'r'});assert.match(roomExport(draft,[],true),/2022-01-01/);});

import {visualCells,visualWindow,visualDay,tally,primaryTopic} from '../src/intelligence-room/visual-model.ts';
test('visual buckets conserve records and distinguish capture clocks from publication',()=>{const rows=[...catalog.records,...demoMaterials];for(const mode of ['timeline','radar'])for(const range of ['month','all']){const chart=visualCells(rows,mode,range);assert.equal(chart.cells.flatMap(c=>c.items).length,chart.items.length);assert.equal(new Set(chart.cells.flatMap(c=>c.items.map(m=>m.id))).size,chart.items.length);for(const cell of chart.cells)for(const m of cell.items)assert.ok(visualDay(m)>=cell.from&&visualDay(m)<=cell.to);}const snapshot={...demoMaterials[0],kind:'data',date:'2020-01-01',captured:'2026-10-27',provenance:'snapshot'};assert.equal(visualDay(snapshot),'2026-10-27');assert.equal(visualWindow([snapshot], 'month').items.length,1);assert.equal(tally([snapshot]).capture,1);assert.equal(primaryTopic({topics:['security','agents']}),'agents');});
test('empty and source-only visual windows do not fabricate activity',()=>{assert.deepEqual(visualCells([],'timeline','month').cells,[]);const chart=visualCells(catalog.records,'radar','all');assert.equal(tally(chart.items).demo,0);assert.equal(chart.items.length,catalog.records.length);const rows=[{...demoMaterials[0],date:'2026-10-27'},{...demoMaterials[1],date:'2022-01-01'}];assert.equal(visualWindow(rows,'month').outside,1);assert.equal(visualWindow(rows,'all').outside,0);});
test('expanded evidence has at least 500 genuinely retrieved records and all observable entity families',()=>{
 const expanded=JSON.parse(fs.readFileSync('data/reference/intelligence/expanded.json','utf8'));
 const retrieved=expanded.records.filter(r=>['Apache project directory','Apache committees directory','Google Patents','Official public page'].includes(r.source));
 assert.ok(retrieved.length>=500);assert.equal(new Set(retrieved.map(r=>r.url)).size,retrieved.length);
 for(const type of ['person','project','organization','foundation','university','model','dataset','patent','compute','energy','conference','event','geography','content'])assert.ok(catalog.records.some(r=>r.entityTypes?.includes(type)),type);
 assert.ok(expanded.records.every(r=>r.provenance!=='demo'));
 for(const r of expanded.records.filter(r=>r.entityTypes.includes('patent'))){assert.equal(r.dateBasis,'published');assert.ok(r.date<'2026-10-27');}
 const bad=structuredClone(catalog);bad.records[0].entityTypes=['invented-type'];assert.throws(()=>validateCatalog(bad));
});

import {normalizeReader,toggleReader} from '../src/intelligence-room/reader.ts';
test('reading metadata survives malformed local storage within bounded limits',()=>{
 assert.deepEqual(normalizeReader(null),{read:[],saved:[]});
 assert.deepEqual(normalizeReader({read:['a','a',null,4,'','x'.repeat(241)],saved:'bad'}),{read:['a'],saved:[]});
 assert.equal(normalizeReader({saved:Array.from({length:2400},(_,i)=>'source:'+i)}).saved.length,2000);
 assert.deepEqual(toggleReader(['a','b'],'a'),['b']);assert.deepEqual(toggleReader(['a'],'b'),['a','b']);
});

import {normalizeNotebooks,contextIds,notebookBundle,notebookMarkdown} from '../src/intelligence-room/notebook-model.ts';
test('notebooks normalize bounded state and preserve independent question source context',()=>{
 const s=normalizeNotebooks({active:'a',books:[{id:'a',title:'x'.repeat(200),sourceIds:['real','real','aurora-initial','bad<>'],excluded:['real'],questions:[{id:'q',text:'Why?',sourceIds:['real']}],notes:[{id:'note',title:'My note',body:'Body',origin:'not-ai',sourceIds:['real']}]},{id:'a',title:'duplicate'},null,{id:'<script>'}]});
 assert.equal(s.books.length,1);assert.equal(s.books[0].title.length,120);assert.equal(s.books[0].notes[0].origin,'manual');
 const real={...demoMaterials[0],id:'real',provenance:'source',url:'https://example.org/source'};
 assert.deepEqual(contextIds(s.books[0],[real,...demoMaterials]),[]);
 s.books[0].excluded=[];assert.deepEqual(contextIds(s.books[0],[real,...demoMaterials]),['real']);
 s.books[0].sourceIds=[];assert.deepEqual(s.books[0].questions[0].sourceIds,['real']);
 const bundle=notebookBundle(s.books[0],[real]);assert.equal(bundle.execution,'not-connected');assert.equal(bundle.sources[0].id,'real');assert.equal(bundle.sources[0].url,real.url);
 assert.match(notebookMarkdown(s.books[0],[],true),/unavailable/);assert.match(notebookMarkdown(s.books[0],[real],true),/questions not executed/);
});

import {caseSources,caseSteps,makeInferenceCase} from '../src/intelligence-room/inference-case.ts';
test('inference case keeps actual evidence distinct from editorial analysis and portable edits',()=>{
 const book=makeInferenceCase();assert.equal(book.sourceIds.length,6);assert.equal(book.notes.length,3);assert.ok(caseSources.every(s=>s.provenance==='source'&&s.url.startsWith('https://')));
 assert.ok(caseSteps.every(s=>s.sourceIds.every(id=>book.sourceIds.includes(id))));
 book.notes[0].body='My edited analysis';const normalized=normalizeNotebooks({active:book.id,books:[book]});assert.equal(normalized.books[0].caseId,'inference');assert.equal(normalized.books[0].notes[0].origin,'example');assert.equal(normalized.books[0].notes[0].body,'My edited analysis');
 const bundle=notebookBundle(book,caseSources);assert.equal(bundle.editorialWalkthrough.length,3);assert.equal(bundle.execution,'not-connected');assert.match(notebookMarkdown(book,caseSources,true),/My edited analysis/);assert.equal(normalizeNotebooks({books:Array.from({length:13},(_,i)=>({...book,id:'b'+i}))}).books.length,13);
});
