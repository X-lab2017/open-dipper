"""Bounded metadata-only public adapters; explicit source health, no media/full-text mirroring."""
import json, hashlib, datetime as dt, urllib.request, urllib.parse, xml.etree.ElementTree as ET, re, sys
from pathlib import Path
from email.utils import parsedate_to_datetime
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/reference/intelligence/collected.json'
SOURCES=[('hf-papers','Hugging Face Papers','paper','https://huggingface.co/api/daily_papers'),('hf-blog','Hugging Face','blog','https://huggingface.co/blog/feed.xml'),('arxiv','arXiv','paper','https://export.arxiv.org/api/query?search_query=all:open-source+AND+cat:cs.AI&start=0&max_results=40&sortBy=submittedDate&sortOrder=descending'),('hn','Hacker News','social','https://hn.algolia.com/api/v1/search_by_date?query=open%20source%20AI&tags=story&hitsPerPage=40')]
def clean(s):
 import html
 return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s or ''))).strip()[:220]
def date(s):
 try:return dt.datetime.fromisoformat(s.replace('Z','+00:00')).date().isoformat()
 except ValueError:
  try:return parsedate_to_datetime(s).date().isoformat()
  except Exception:return None
def url(s):
 p=urllib.parse.urlparse(s or '');return s if p.scheme in ('https','http') and p.netloc else None
def parse(kind,raw):
 if kind=='daily':return [(r['paper']['title'],r['paper']['publishedAt'],'https://arxiv.org/abs/'+r['paper']['id']) for r in json.loads(raw)[:50] if re.fullmatch(r'\d{4}\.\d{4,5}',r.get('paper',{}).get('id',''))]
 if kind=='social':return [(r.get('title'),r.get('created_at'),f"https://news.ycombinator.com/item?id={r['objectID']}") for r in json.loads(raw)['hits'] if r.get('title')]
 root=ET.fromstring(raw);rows=root.findall('.//item') or root.findall('{http://www.w3.org/2005/Atom}entry')
 def f(r,k):
  n=r.find(k)
  if n is None:n=r.find('{http://www.w3.org/2005/Atom}'+k)
  return (n.text or n.attrib.get('href','')) if n is not None else ''
 return [(f(r,'title'),f(r,'pubDate') or f(r,'published'),f(r,'link') or f(r,'id')) for r in rows[:60]]
def collect(skip_arxiv=False):
 now=dt.datetime.now(dt.timezone.utc);stamp=now.isoformat();old=json.loads(OUT.read_text()) if OUT.exists() else {'records':[],'health':[]};rows={r['url']:r for r in old['records']};health=[]
 for sid,name,kind,endpoint in SOURCES:
  prev=next((h for h in old['health'] if h['id']==sid),{})
  if prev.get('checkedAt') and (now-dt.datetime.fromisoformat(prev['checkedAt'])).total_seconds()<21600:health.append(prev);continue
  try:
   if sid=='arxiv' and skip_arxiv:raise RuntimeError('429 observed during initial access check; no immediate retry')
   req=urllib.request.Request(endpoint,headers={'User-Agent':'OpenDipper/1.7 metadata index (github.com/X-lab2017/open-dipper)'})
   with urllib.request.urlopen(req,timeout=18) as res:
    body=res.read(1500001)
   if len(body)>1500000:raise ValueError('response exceeds bound')
   incoming=parse('daily' if sid=='hf-papers' else kind,body);accepted=0
   for title,published,link in incoming:
    day=date(published or '')
    if not title or not day or day>now.date().isoformat() or not url(link):continue
    key='external-'+hashlib.sha256(link.encode()).hexdigest()[:20]
    prior=rows.get(link);rows[link]={'id':key,'kind':kind,'provenance':'source','date':day,'publishedAt':day,'captured':prior['captured'] if prior else now.date().isoformat(),'title':[clean(title),clean(title)],'summary':['公开来源元数据；点击原文阅读。内容未经本站独立验证。','Public source metadata. Read the original; claims are not independently verified.'],'source':name,'sourceId':sid,'url':link,'objects':[name],'topics':[],'modality':'document' if kind=='paper' else 'text','verification':'aggregator-metadata' if sid=='hf-papers' else 'source-metadata','sourceUrl':endpoint};accepted+=1
   if not accepted:raise ValueError('no valid dated records; last-good preserved')
   health.append({'id':sid,'name':name,'url':endpoint,'status':'ok','checkedAt':stamp,'lastSuccess':stamp,'count':accepted})
  except Exception as e:health.append({'id':sid,'name':name,'url':endpoint,'status':'unavailable','checkedAt':stamp,'lastSuccess':prev.get('lastSuccess'),'error':str(e)[:180],'count':sum(r.get('sourceId')==sid for r in rows.values())})
 records=[]
 for sid,_,_,_ in SOURCES:records.extend(sorted([r for r in rows.values() if r.get('sourceId')==sid],key=lambda r:r['date'],reverse=True)[:80])
 records.sort(key=lambda r:r['date'],reverse=True);
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps({'schemaVersion':1,'checkedAt':stamp,'records':records,'health':health},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'records':len(records),'health':health},ensure_ascii=False))
if __name__=='__main__':collect('--skip-arxiv' in sys.argv)
