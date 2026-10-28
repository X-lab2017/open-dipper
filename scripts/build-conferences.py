"""Deterministic Conference Partner snapshot adapter; never invent dates or coordinates."""
import json,re,sys,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads((ROOT/p).read_text())
def validate(raw):
 rows=raw['conferences'];assert 0<len(rows)<=2000 and raw['count']==len(rows)
 ids=set()
 for r in rows:
  assert isinstance(r['id'],int) and r['id'] not in ids;ids.add(r['id'])
  assert r['ccf_rank'] in ['A','B','C']
  assert r['detail_page']==f"https://www.myhuiban.com/conference/{r['id']}"
  for k in ['short_name','full_name','location']:assert isinstance(r[k],str) and len(r[k])<500
  for k in ['submission_date','notification_date','conference_date']:
   if r[k]:
    from datetime import date
    assert re.fullmatch(r'\d{4}-\d{2}-\d{2}',r[k]);date.fromisoformat(r[k])
 return rows
RULES=[('ai',r'artificial intelligence|machine learning|neural|computer vision|pattern recognition|natural language|computational linguistics|robot|knowledge discovery'),('security',r'security|privacy|cryptograph|encryption'),('software',r'software|programming|program comprehension|requirements|compiler'),('data',r'database|data engineering|information retrieval|web|data mining|information system'),('systems',r'network|distributed|parallel|architecture|operating system|cloud|embedded|sensor|sensing|real.time|computing system|storage'),('interaction',r'graphics|multimedia|visual|human|interaction|virtual|ubiquitous'),('theory',r'theory|algorithm|logic|complexity')]
def topic(name):return next((k for k,p in RULES if re.search(p,name,re.I)),'other')
def build():
 raw=read('data/sources/ccf-conferences.json');rows=validate(raw);geo=read('data/reference/conferences/locations.json');meta=read('data/reference/conferences/provenance.json');out=[]
 for r in rows:
  loc=geo['locations'].get(r['location'],{});out.append(dict(id='huiban-'+str(r['id']),short=r['short_name'],name=r['full_name'],rank=r['ccf_rank'],kind='academic',topic=topic(r['full_name']),startsAt=r['conference_date'],submissionDate=r['submission_date'],notificationDate=r['notification_date'],location=r['location'],countryCode=loc.get('countryCode'),point=loc.get('point'),url=r['detail_page'],updatedAt=r.get('updated_at'),extended=r.get('is_extended',False),source='Conference Partner (myhuiban.com)'))
 for r in read('public/data/located-entities.json')['layers']['meetings']:
  out.append(dict(id=r['id'],short=r['entityName'][1],name=r['entityName'][1],rank=None,kind='community',topic='systems',startsAt=r['period'][0][:10],endsAt=r['period'][0][-10:],submissionDate=None,notificationDate=None,location=r['country'],countryCode=r['rawCode'],point=dict(city=r['country'],longitude=r['longitude'],latitude=r['latitude']),url=r['sourceUrls'][0],updatedAt=None,extended=False,source='Organizer / 主办方'))
 return dict(schemaVersion=1,sourceUpdatedAt=raw['generated_at'],capturedAt=meta['capturedAt'],sourceCommit=meta['sourceCommit'],sourceSha256=hashlib.sha256((ROOT/'data/sources/ccf-conferences.json').read_bytes()).hexdigest(),geographySource=geo['source'],rankSource='https://www.ccf.org.cn/Academic_Evaluation/By_category/',rankVerification='Third-party labels; not independently reconciled against the full CCF seventh edition.',topicBasis='Editorial keyword grouping, not official CCF subject taxonomy.',records=out)
if __name__=='__main__':
 s=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';p=ROOT/'public/data/conferences.json'
 if '--check' in sys.argv:assert p.read_text()==s,'Run python3 scripts/build-conferences.py'
 else:p.write_text(s)
 print('Conferences:',len(json.loads(s)['records']))
