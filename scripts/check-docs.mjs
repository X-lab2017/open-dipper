// Offline checks only: local inline Markdown file links, context paths/commands.
// Does not resolve heading anchors, external URLs, or reference-style links.
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, resolve, relative, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const context = read('docs/CONTEXT.json');
const scripts = read('package.json').scripts;
const errors = [];
const markdownLinks = content => [...content.matchAll(/\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g)].map(match => match[1]);
function checkPath(path, owner, base = root) {
  const target = resolve(base, path);
  const rel = relative(root, target);
  if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(target)) errors.push(`${owner}: missing or out-of-repository path ${path}`);
}
if (context.schemaVersion !== 1) errors.push('Unsupported context schemaVersion');
const seen = new Set();
for (const entry of context.entries) {
  checkPath(entry.path, 'Context entry');
  if (seen.has(entry.path)) errors.push(`Duplicate context entry: ${entry.path}`);
  seen.add(entry.path);
}
for (const [name, task] of Object.entries(context.tasks)) {
  for (const path of [...task.read, ...task.edit]) checkPath(path, `Task ${name}`);
  for (const command of task.checks) if (!scripts[command]) errors.push(`Task ${name}: unknown npm script ${command}`);
}
for (const route of context.routes) checkPath(route.path, 'Route');
for (const path of context.generated) checkPath(path, 'Generated index');

// Entry translations share navigation and executable examples. Prose meaning
// still needs review; these checks detect structural drift, not translation quality.
const aliases = new Map();
for (const group of context.translations ?? []) {
  const canonical = group.editions.find(e => e.language === group.defaultLanguage);
  if (!canonical) { errors.push(`Translation ${group.id}: missing default language`); continue; }
  for (const edition of group.editions) aliases.set(edition.path, canonical.path);
}
const canonicalLink = href => aliases.get(href) ?? href;
const fences = content => [...content.matchAll(/^```([^\n]*)\n([\s\S]*?)^```\s*$/gm)].map(m => ({language: m[1].trim(), body: m[2].trim()}));
let translations = 0;
for (const group of context.translations ?? []) {
  let reference;
  for (const edition of group.editions) {
    checkPath(edition.path, `Translation ${group.id}`);
    if (!existsSync(resolve(root, edition.path))) continue;
    const content = readFileSync(resolve(root, edition.path), 'utf8');
    const sections = [...content.matchAll(/^<!-- section:([a-z-]+) -->$/gm)].map(m => m[1]);
    if (!sections.length || new Set(sections).size !== sections.length) errors.push(`${edition.path}: missing or duplicate section IDs`);
    const hrefs = markdownLinks(content);
    for (const other of group.editions) {
      if (other.path !== edition.path && !hrefs.includes(other.path)) errors.push(`${edition.path}: missing language switch to ${other.path}`);
    }
    const blocks = fences(content);
    const shape = {
      sections,
      links: [...new Set(hrefs.map(canonicalLink))].sort(),
      examples: blocks.filter(b => b.language !== 'mermaid'),
      diagrams: blocks.filter(b => b.language === 'mermaid').map(b => b.body.replace(/"[^"\n]*"/g, '""').replace(/\s+/g, ' ').trim()),
    };
    if (reference) {
      for (const key of Object.keys(shape)) {
        if (JSON.stringify(shape[key]) !== JSON.stringify(reference.shape[key])) errors.push(`${edition.path}: translation ${key} drift from ${reference.path}; update both editions`);
      }
    } else reference = {path: edition.path, shape};
    translations++;
  }
}
const paths = [...new Set(execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '*.md'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean))];
// Verbatim upstream notice links resolve in its source repository, not ours.
const upstreamNotices = new Set(['public/brand/UPSTREAM_NOTICE.md']);
let links = 0;
for (const path of paths) {
  if (upstreamNotices.has(path)) continue;
  if (!existsSync(resolve(root, path))) continue; // staged deletion
  const content = readFileSync(resolve(root, path), 'utf8')
    .replace(/^\s*(```|~~~)[\s\S]*?^\s*\1[^\n]*$/gm, '')
    .replace(/`[^`\n]*`/g, '');
  for (const match of content.matchAll(/\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (href.startsWith(`${context.repository}/issues/new?`)) {
      const template = new URL(href).searchParams.get('template');
      if (template) checkPath(`.github/ISSUE_TEMPLATE/${template}`, `${path} issue button`);
    }
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
    let local;
    try { local = decodeURIComponent(href.split(/[?#]/)[0]); }
    catch { errors.push(`${path}: invalid link encoding ${href}`); continue; }
    if (!local) continue;
    links++;
    checkPath(local.replace(/^\//, ''), path, local.startsWith('/') ? root : dirname(resolve(root, path)));
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Docs verified: ${paths.length} Markdown files, ${links} local inline links, ${Object.keys(context.tasks).length} task recipes, ${translations} language editions (external URLs/anchors and translation meaning not checked)`);
