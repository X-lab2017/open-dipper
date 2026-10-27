import type {Event, Lang} from './model';

export type Copy = {zh: string; en: string};
export type Topic = 'models' | 'agents' | 'research' | 'ecosystem';
export type Page = 'overview' | 'radar' | 'ecosystem' | 'briefing' | 'contribute' | 'following';
export const topics: Record<Topic, Copy> = {
  models: {zh: '模型与能力', en: 'Models & capabilities'},
  agents: {zh: 'Agent 与工具', en: 'Agents & tools'},
  research: {zh: '研究与复现', en: 'Research & reproduction'},
  ecosystem: {zh: '开放生态与治理', en: 'Ecosystem & governance'},
};
export const pages: Record<Page, Copy> = {
  overview: {zh: '全球观测', en: 'Observatory'}, radar: {zh: 'AI 雷达', en: 'AI radar'},
  ecosystem: {zh: '开源星系', en: 'Open Galaxy'}, briefing: {zh: 'Agent 情报室', en: 'Agent Room'},
  contribute: {zh: '共建社区', en: 'Community'}, following: {zh: '我的关注', en: 'Following'},
};
export type Signal = {
  id: string; topic: Topic; title: Copy; summary: Copy; why: Copy; next: Copy;
  publishedAt: string; capturedAt: string; provenance: 'demo' | 'automatic' | 'manual';
  source: string; sourceUrl: string; eventId?: string; repository?: string;
  location: Event['location']; evidence: {kind: Copy; status: Copy; url: string}[];
  openness: Copy; tags: string[];
};
export type Intelligence = {schemaVersion: 1; fixtureDate: string; signals: Signal[]};
export type Preferences = {topics: Topic[]; saved: string[]; cadence: 'weekly' | 'daily'; demo: boolean};
export const defaultPreferences: Preferences = {topics: [], saved: [], cadence: 'weekly', demo: true};
const isCopy = (x: any): x is Copy => !!x && typeof x.zh === 'string' && typeof x.en === 'string';
const dateOK = (x: unknown) => typeof x === 'string' && Number.isFinite(Date.parse(x));
const urlOK = (x: unknown) => typeof x === 'string' && (!x || /^https?:\/\//i.test(x));

// Separate, fixed fictional fixtures. A malformed file is rejected as a whole.
export function validateIntelligence(x: any): x is Intelligence {
  return !!x && x.schemaVersion === 1 && dateOK(x.fixtureDate) && Array.isArray(x.signals) &&
    x.signals.length <= 100 && new Set(x.signals.map((s: any) => s?.id)).size === x.signals.length &&
    x.signals.every((s: any) => s && typeof s.id === 'string' && s.id.startsWith('intel-demo-') &&
      Object.hasOwn(topics, s.topic) && s.provenance === 'demo' && dateOK(s.publishedAt) && dateOK(s.capturedAt) &&
      [s.title, s.summary, s.why, s.next, s.openness].every(isCopy) && typeof s.source === 'string' &&
      s.sourceUrl === '' && (!s.repository || typeof s.repository === 'string') &&
      Array.isArray(s.tags) && s.tags.every((t: unknown) => typeof t === 'string') &&
      Array.isArray(s.evidence) && s.evidence.every((e: any) => e && isCopy(e.kind) && isCopy(e.status) && urlOK(e.url)) &&
      (s.location === null || (s.location && typeof s.location.name === 'string' &&
        typeof s.location.countryCode === 'string' && s.location.precision === 'simulated' &&
        Number.isFinite(s.location.lon) && Math.abs(s.location.lon) <= 180 &&
        Number.isFinite(s.location.lat) && Math.abs(s.location.lat) <= 90)));
}

export async function loadIntelligence(base: string): Promise<Intelligence | null> {
  try {
    const response = await fetch(`${base}data/intelligence-demo.json`);
    if (!response.ok) return null;
    const result: unknown = await response.json();
    return validateIntelligence(result) ? result : null;
  } catch { return null; }
}

// Explicit topic index, not an AI judgement or an inference about all source content.
export const repositoryTopics: Record<string, Topic> = {
  'pytorch/pytorch': 'models', 'huggingface/transformers': 'models', 'vllm-project/vllm': 'models',
  'ollama/ollama': 'models', 'langchain-ai/langchain': 'agents',
};
export function topicForEvent(event: Event): Topic | null {
  if (event.provenance === 'demo') return null;
  if (event.repository && Object.hasOwn(repositoryTopics, event.repository)) return repositoryTopics[event.repository];
  const explicit = event.tags.find(t => t.startsWith('ai-topic:'))?.slice(9);
  return explicit && Object.hasOwn(topics, explicit) ? explicit as Topic : null;
}
export function signalFromEvent(event: Event): Signal | null {
  const topic = topicForEvent(event);
  if (!topic) return null;
  return {
    id: `event:${event.id}`, eventId: event.id, topic,
    title: {zh: event.title, en: event.titleEn || event.title},
    summary: {zh: event.summary, en: event.summaryEn || event.summary},
    why: {zh: '该条目来自已配置的 AI 项目来源。影响分析尚待补充，请先查看原始发布及关联项目。', en: 'This item belongs to a configured AI project. Impact analysis is pending; inspect the original release and project first.'},
    next: {zh: '核对版本说明、适用范围与迁移要求，再决定是否试用。', en: 'Check release notes, scope and migration requirements before trying it.'},
    publishedAt: event.occurredAt, capturedAt: event.collectedAt, provenance: event.provenance,
    source: event.source, sourceUrl: event.sourceUrl, location: event.location, repository: event.repository,
    evidence: [{kind: {zh: '原始发布', en: 'Original publication'}, status: {zh: '来源已发布；保留原文', en: 'Source-published; original wording'}, url: event.sourceUrl}],
    openness: {zh: '以项目当前许可为准', en: 'Check the project license'}, tags: event.tags,
  };
}
export function signalsFor(feed: Event[], fixture: Intelligence | null, includeDemo: boolean): Signal[] {
  const observed = feed.map(signalFromEvent).filter((s): s is Signal => !!s);
  return [...observed, ...(includeDemo ? fixture?.signals ?? [] : [])].sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
export function filterSignals(signals: Signal[], topic: string, query = ''): Signal[] {
  const q = query.trim().toLowerCase();
  return signals.filter(s => (topic === 'all' || s.topic === topic) &&
    `${s.title.zh} ${s.title.en} ${s.summary.zh} ${s.summary.en} ${s.repository || ''} ${s.tags.join(' ')}`.toLowerCase().includes(q));
}
export function preferencesFrom(value: unknown): Preferences {
  const x = value && typeof value === 'object' ? value as Partial<Preferences> : {};
  return {
    topics: Array.isArray(x.topics) ? [...new Set(x.topics.filter(t => typeof t === 'string' && Object.hasOwn(topics, t)))] : [],
    saved: Array.isArray(x.saved) ? [...new Set(x.saved.filter(s => typeof s === 'string' && s.length <= 160))].slice(0,200) : [],
    cadence: x.cadence === 'daily' ? 'daily' : 'weekly', demo: x.demo !== false,
  };
}
export function matchingSignals(signals: Signal[], prefs: Preferences, repositories: string[]): Signal[] {
  return signals.filter(s => prefs.saved.includes(s.id) || prefs.topics.includes(s.topic) || !!s.repository && repositories.includes(s.repository));
}
export function asDemoEvent(s: Signal): Event {
  return {id:s.id, title:s.title.zh, titleEn:s.title.en, summary:s.summary.zh, summaryEn:s.summary.en,
    category:s.topic==='research'?'research':s.topic==='ecosystem'?'foundation':'release',severity:'info',
    occurredAt:s.publishedAt,collectedAt:s.capturedAt,source:s.source,sourceUrl:'',provenance:'demo',reviewStatus:'demo',
    location:s.location,tags:[...s.tags,'intelligence-demo']};
}
export function parsePage(hash: string): Page {
  const key = hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return Object.hasOwn(pages, key) ? key as Page : 'overview';
}
export function exportBrief(signals: Signal[], lang: Lang, cadence: string): string {
  const choose = (c: Copy) => c[lang];
  const header = lang === 'zh' ? '# OpenDipper · 本机情报预览\n\n这是当前缓存条目的导出，不代表新采集、订阅生效或编辑审阅。固定模拟内容不构成事实。' : '# OpenDipper · Local intelligence preview\n\nExport of cached items, not a fresh collection, active subscription or editorial review. Fixed fictional items are not facts.';
  return `${header}\n\n${lang === 'zh' ? '偏好频率' : 'Preferred cadence'}: ${cadence}\n\n` + signals.map(s =>
    `## ${s.provenance==='demo'?'[DEMO] ':''}${choose(s.title)}\n\n${choose(s.summary)}\n\n${s.publishedAt} · ${s.source}\n\n${s.sourceUrl || (lang==='zh'?'虚构场景，无事实来源':'Fictional scenario; no factual source')}\n`).join('\n');
}
