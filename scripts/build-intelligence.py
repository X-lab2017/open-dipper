"""Deterministic evidence catalog: reuse pinned inputs without claiming full indexing."""
import json,hashlib,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads((ROOT/p).read_text())
def hid(s):return hashlib.sha256(s.encode()).hexdigest()[:20]
def topics(text):
 rules={'agents':r'agent|tool.?use|react|智能体','models':r'model|llm|dataset|模型|训练|transformer','infra':r'infer|kubernetes|gpu|runtime|serving|cloud|compiler','security':r'secur|vulnerab|safety|安全','governance':r'licen|govern|policy|standard|合规','ecosystem':r'communit|contribut|open.?source|foundation|生态'}
 return [k for k,p in rules.items() if re.search(p,text,re.I)] or ['ecosystem']
def build():
 collected=read('data/reference/intelligence/collected.json');records=read('data/reference/intelligence/curated.json')+collected['records'];expanded=read('data/reference/intelligence/expanded.json');records+=expanded['records'];catalog=read('public/data/radar-catalog.json');entities={e['url']:e for e in expanded['entities']};links=[]
 for e in catalog['entities']:
  eid='object-'+hid(e['url']);entities[e['url']]={'id':eid,'name':e['name'],'type':{'software':'project','model':'model','dataset':'dataset'}[e['kind']],'url':e['url']};src=next(s for s in catalog['sources'] if s['id']==e['sourceIds'][0]);metric=next((m for m in e['metrics'] if m.get('status')=='observed'),None)
  summary=[e['description']['zh'],e['description']['en']];scope=src.get('scope',{});period=[scope.get('zh','原始来源范围'),scope.get('en','Original source scope')]
  if metric:summary=[summary[0]+f" · {metric['label']['zh']}: {metric['value']} ({metric.get('period')})",summary[1]+f" · {metric['label']['en']}: {metric['value']} ({metric.get('period')})"]
  records.append(dict(id='radar-'+hid(e['url']),kind='data',provenance='snapshot',date=catalog['assembledAt'],publishedAt=None,dateBasis='captured',captured=catalog['assembledAt'],title=[e['name']+' · 雷达候选档案',e['name']+' · radar profile'],summary=summary,source=src['name'],url=e['url'],sourceUrl=src['url'],objects=[e['name']],entityUrls=[e['url']],topics=[],modality='data',period=period,page='radar'))
 graph=read('public/data/galaxy/code.json');chosen=sorted([n for n in graph['nodes'] if n['category'] in ('AI','Agentic AI','Cloud Native')],key=lambda n:-(n.get('openrank') or 0))[:50]
 for e in chosen:
  if e['url'] in entities:continue
  entities[e['url']]={'id':'object-'+hid(e['url']),'name':e['name'],'type':'project','url':e['url']}
  records.append(dict(id='galaxy-'+hid(e['url']),kind='data',provenance='snapshot',date='2026-10-26',publishedAt=None,dateBasis='captured',captured='2026-10-26',title=[e['name']+' · 星系档案',e['name']+' · galaxy profile'],summary=[f"{e['category']} · 上游共享贡献者网络中的节点；不代表组织合作。",f"{e['category']} · node in an upstream shared-contributor graph, not an organizational partnership."],source='OpenGalaxy / OpenDigger',url=e['url'],sourceUrl=graph['meta']['upstreamUrl'],objects=[e['name']],entityUrls=[e['url']],topics=[],modality='data',period=['上游窗口 2025.08—2026.07；精选 50 个 AI / Agent / 云原生节点，按 OpenRank 取样','Upstream Aug 2025–Jul 2026; top 50 AI / Agent / cloud-native nodes by OpenRank'],page='ecosystem'))
 for e in read('public/data/located-entities.json')['layers']['meetings']:
  records.append(dict(id='meeting-'+e['id'],kind='conference',provenance='source',date='2026-10-25',publishedAt=None,dateBasis='captured',captured='2026-10-25',title=e['entityName'],summary=['全球观测中已收录的会议；活动日期与收录日期分开记录。','Conference from the observatory; event dates differ from capture dates.'],source='Observatory / organizer',url=e['sourceUrls'][0],objects=[e['entityName'][0]],topics=['infra','ecosystem'],modality='event',period=e['period']))
 # Canonical URL deduplication preserves earliest capture; first curated record wins.
 dedup={}
 for r in records:
  r.setdefault('topics',[])
  if not r['topics']:r['topics']=topics(' '.join(r['title']+r['objects']))
  r.setdefault('dateBasis','published');r.setdefault('verification','source-metadata');r.setdefault('entityUrls',[])
  if r['url'] not in dedup:dedup[r['url']]=r
 for r in dedup.values():
  r.setdefault('entityTypes',sorted({entities[u]['type'] for u in r['entityUrls'] if u in entities}))
  for u in r['entityUrls']:
   if u not in entities:entities[u]={'id':'object-'+hid(u),'name':u.rstrip('/').split('/')[-1],'type':'project','url':u}
   links.append({'from':r['id'],'to':entities[u]['id'],'type':'describes' if r['kind']=='data' else 'references','evidenceUrl':r.get('sourceUrl',r['url']),'status':'source-recorded'})
 return {'schemaVersion':1,'assembledAt':collected['checkedAt'],'taxonomyVersion':'1','records':sorted(dedup.values(),key=lambda r:r['date'],reverse=True),'entities':list(entities.values()),'links':links,'health':collected['health']+expanded['health']}
if __name__=='__main__':
 p=ROOT/'public/data/intelligence-catalog.json';s=json.dumps(build(),ensure_ascii=False,indent=2)+'\n'
 if '--check' in sys.argv:
  assert p.read_text()==s,'Run python scripts/build-intelligence.py'
 else:p.write_text(s)
 print('Intelligence catalog:',len(json.loads(s)['records']),'records')
