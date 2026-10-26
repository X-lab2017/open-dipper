import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const base = new URL('../public/data/galaxy/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, base), 'utf8'));
const code = read('code.json');
const model = read('model.json');
const manifest = read('manifest.json');

test('real graph coverage and immutable provenance are preserved', () => {
  assert.equal(code.nodes.length, 19771);
  assert.equal(code.edges.length, 106650);
  assert.equal(model.nodes.length, 24000);
  assert.equal(model.edges.length, 43263);
  assert.deepEqual(model.meta.kinds, { dataset: 7000, model: 12000, space: 5000 });
  assert.deepEqual(code.meta.period, { start: '202508', end: '202607', months: 12 });
  assert.equal(model.meta.snapshotAt, '2026-08-05T13:32:27.000Z');
  assert.equal(manifest.sourceCommit, '7f69f2fbd27860f1f207be197dfe0597216d7b0d');
  for (const name of ['code.json', 'model.json']) {
    const raw = readFileSync(new URL(name, base));
    assert.equal(createHash('sha256').update(raw).digest('hex'), manifest.files[name].sha256);
    assert.equal(raw.byteLength, manifest.files[name].bytes);
    assert.ok(raw.byteLength < 12 * 1024 * 1024);
  }
});

test('coordinates and metric identity are not fabricated or conflated', () => {
  const nix = code.nodes.find(node => node.name === 'NixOS/nixpkgs');
  assert.equal(nix.id, 'GitHub:4542716');
  assert.deepEqual([nix.x, nix.y, nix.openrank], [0.18819, 0.21186, 17378.242]);
  assert.equal(nix.size, nix.openrank);
  assert.equal(code.meta.sizeMetric, 'openrank-sum-12-months');
  assert.equal(model.meta.sizeMetric, 'upstream-display-weight');
  assert.ok(model.nodes.every(node => !('openrank' in node) && !('contributors' in node)));
  assert.ok(model.edges.every(edge => edge[4] === null));
  assert.ok(code.edges.every(edge => edge[4] >= 2));
  for (const graph of [code, model]) {
    assert.ok(graph.nodes.every(node => [...(node.description ?? '')].length <= 160));
    assert.ok(graph.nodes.every(node => (node.topics?.length ?? 0) <= 5 && (node.topics ?? []).every(topic => [...topic].length <= 50)));
  }
});

test('declared model edges stay separate from inference and do not claim direction', () => {
  assert.equal(model.meta.direction, 'undirected');
  assert.equal(model.meta.lineageDirectionAvailable, false);
  assert.equal(model.edges.filter(edge => !edge[5]).length, 19305);
  assert.equal(model.edges.filter(edge => edge[5]).length, 23958);
  assert.ok(model.edges.every(edge => Boolean(edge[5]) === model.meta.relationTypes[edge[3]].startsWith('inferred-')));
  assert.equal(model.meta.relationCounts['base-model'], 4116);
  assert.equal(model.meta.relationCounts['same-author'], 14083);
  assert.deepEqual(code.meta.relationTypes, ['shared-contributors']);
});

test('all nodes and relations pass the bounded offline importer check', () => {
  const output = execFileSync('python3', ['scripts/import-galaxy.py', '--check'], {
    cwd: new URL('..', import.meta.url), encoding: 'utf8', timeout: 20000,
  });
  assert.match(output, /verified/);
});
