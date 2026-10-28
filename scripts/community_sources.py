"""Public community-list adapters. No accounts, arbitrary URL follow-ups or date guessing."""
import calendar,hashlib,json,re,unicodedata
from datetime import date
from html.parser import HTMLParser
from urllib.parse import urlsplit,urlunsplit

class Node:
 def __init__(self,tag='',attrs=()):self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self):return ' '.join((x.text() if isinstance(x,Node) else x) for x in self.children).strip()
 def all(self,predicate):
  return ([self] if predicate(self) else [])+[n for c in self.children if isinstance(c,Node) for n in c.all(predicate)]
 def has(self,c):return c in self.attrs.get('class','').split()
class Document(HTMLParser):
 def __init__(self,html):
  super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root];self.feed(html)
 def handle_starttag(self,tag,attrs):
  node=Node(tag,attrs);self.stack[-1].children.append(node)
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append(node)
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if self.stack[-1].tag not in ['script','style','svg','path']:self.stack[-1].children.append(data)
def clean(s):return re.sub(r'\s+',' ',s).strip()
def safe_url(s):
 assert isinstance(s,str) and len(s)<2000
 p=urlsplit(s);assert p.scheme in ['http','https'] and p.hostname and not p.username and not p.password
 return s
def canonical(s):
 p=urlsplit(safe_url(s));return urlunsplit((p.scheme.lower(),p.netloc.lower(),p.path.rstrip('/'),p.query,''))
def parse_lf(html,page,listing):
 doc=Document(html).root;records=[]
 for n in doc.all(lambda n:n.tag=='article' and n.has('callout')):
  headings=n.all(lambda n:n.tag in ['h4','h5']);assert headings,'Missing event heading'
  links=headings[0].all(lambda n:n.tag=='a');assert links
  field=lambda c:next((clean(x.text()) for x in n.all(lambda n:n.has(c))),'')
  records.append(dict(sourceId=n.attrs['id'],title=clean(links[0].text()),url=safe_url(links[0].attrs['href']),dateLabel=field('date'),location=field('country') or field('virtual'),cfpStatus=field('cfp').removeprefix('CFP Status:').strip(),sourcePage=page,listing=listing))
 assert 0<len(records)<=500 and len({r['sourceId'] for r in records})==len(records)
 for r in records:assert r['title'] and r['dateLabel'] and r['location']
 expected=re.search(r'Displaying\s+(\d+)\s+events',html)
 if expected:assert len(records)==int(expected[1]),'Truncated or paginated calendar'
 return records
def parse_deadlines(doc,file):
 assert isinstance(doc,list) and 0<len(doc)<=1000
 records=[]
 for item in doc:
  assert item['category'] in ['conference','competition','activity']
  for e in item['events']:
   assert isinstance(e['id'],str) and isinstance(e['date'],str)
   records.append(dict(sourceId=e['id'],title=item['title'],sourceCategory=item['category'],tags=item.get('tags',[]),url=safe_url(e['link']),dateLabel=e['date'],location=e['place'],timezone=e.get('timezone'),year=e['year'],timeline=e.get('timeline',[]),sourceFile=file,locationConflict=e['place']=='线上' and '线下实习' in item.get('description','')))
 return records
def iso(y,m,d):
 try:return date(int(y),int(m),int(d)).isoformat()
 except (ValueError,TypeError):return None
MONTHS={name.lower():i for i in range(1,13) for name in [calendar.month_name[i],calendar.month_abbr[i]]}
def date_range(label):
 """Only explicit calendar dates; vague months and open ends remain unknown."""
 s=re.sub(r'\s+','',label);start=end=None;rest=''
 m=re.match(r'(\d{4})年(\d{1,2})月(\d{1,2})日',s)
 if m:
  y,month,day=m.groups();start=iso(y,month,day);rest=s[m.end():]
  n=re.match(r'[-—–至](?:(\d{4})年)?(?:(\d{1,2})月)?(\d{1,2})日',rest)
  if n:end=iso(n[1] or y,n[2] or month,n[3])
 else:
  s=clean(label);m=re.match(r'([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:[–—-](\d{1,2}))?,?\s+(\d{4})',s)
  if m and m[1].lower() in MONTHS:
   month=MONTHS[m[1].lower()];start=iso(m[4],month,m[2]);end=iso(m[4],month,m[3]) if m[3] else None;rest=s[m.end():]
   n=re.match(r'\s*[-–—]\s*([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})',rest)
   if n and n[1].lower() in MONTHS:end=iso(n[3],MONTHS[n[1].lower()],n[2])
 if start and not end and (not rest or re.match(r'^\d{1,2}:\d{2}',rest) or rest.startswith('#')):end=start
 if end and start and end<start:raise ValueError('Reversed date range')
 return start,end
def community_type(r):
 text=r['title']+' '+' '.join(r.get('tags',[]))
 if re.search(r'训练营|集训|夏令营|开源之夏|summer of code|实习|培养|招募|课程|OpenCamp|大学行|校园行|校园开源',text,re.I):return 'program'
 if re.search(r'竞赛|挑战赛|大赛|黑客松|hackathon',text,re.I):return 'competition'
 if r.get('sourceCategory')=='conference' or re.search(r'大会|峰会|summit|conference|conf\b|con\b|forum|论坛',text,re.I):return 'conference'
 if r.get('sourceCategory')=='competition':return 'competition'
 return 'meetup'
def topic(text):
 for key,pattern in [('ai',r'\bAI\b|Agent|人工智能|智能体|大模型|PyTorch|Paddle|飞桨|vLLM|Tensor|推理'),('security',r'security|privacy|安全|合规|compliance|confidential'),('data',r'data|数据库|TiDB|Gauss'),('software',r'编程|编译|开发|Rust|Python|React|Vue|Git|软件'),('systems',r'Linux|cloud|云|Kube|CNCF|RISC|Harmony|Euler|内核|系统|算力|存储|网络')]:
  if re.search(pattern,text,re.I):return key
 return 'other'
COUNTRIES={'united states':'USA','usa':'USA','china':'CHN','中国':'CHN','canada':'CAN','ghana':'GHA','kenya':'KEN','india':'IND','japan':'JPN','spain':'ESP','portugal':'PRT','puerto rico':'PRI','england':'GBR','scotland':'GBR','united kingdom':'GBR','netherlands':'NLD','germany':'DEU','korea':'KOR','france':'FRA','hungary':'HUN','switzerland':'CHE','panama':'PAN','nepal':'NPL','哥斯达黎加':'CRI','美国':'USA'}
CITY_ALIASES={'上海':'Shanghai','北京':'Beijing','深圳':'Shenzhen','武汉':'Wuhan','杭州':'Hangzhou','长沙':'Changsha','成都':'Chengdu','西安':"Xi'an",'香港':'Hong Kong','哈尔滨':'Harbin','沈阳':'Shenyang','昆明':'Kunming','大连':'Dalian','明尼阿波利斯':'Minneapolis','Montreal':'Montréal','Panamá':'Panama City','Shenyang':'Shenyeng'}
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s).lower() if c.isalnum())
def geography(location,refs):
 if any(k in location.lower() for k in ['线上','virtual','online']):return None,None
 parts=[x.strip() for x in location.replace('，',',').split(',')]
 country=COUNTRIES.get(parts[0].lower()) or COUNTRIES.get(parts[-1].lower())
 city=parts[-1] if parts[0].lower() in COUNTRIES else parts[0];city=CITY_ALIASES.get(city,city);city=CITY_ALIASES.get(city,city)
 matches={json.dumps(x['point'],sort_keys=True) for x in refs.values() if x.get('point') and (x.get('countryCode')==country or country=='CHN' and x.get('countryCode') in ['TWN','HKG','MAC']) and norm(x['point']['city'])==norm(city)}
 return country,json.loads(next(iter(matches))) if len(matches)==1 else None
def normalize(r,source,refs):
 start,end=date_range(r['dateLabel']);warnings=[]
 if not start:warnings.append('date-unparsed')
 if not end:warnings.append('end-unconfirmed')
 if r.get('locationConflict'):warnings.append('location-conflict')
 milestones=[]
 for m in r.get('timeline',[]):
  raw=str(m.get('deadline',''));day=raw[:10] if re.match(r'^\d{4}-\d{2}-\d{2}',raw) else None
  if day:date.fromisoformat(day)
  label=str(m.get('comment',''));kind='deadline' if re.search(r'截止|截至|deadline|\bcloses?\b',label,re.I) else 'milestone'
  milestones.append(dict(label=label,at=raw,date=day,kind=kind,timezone=r.get('timezone')))
  if day and end and re.search(r'(活动|会议|训练营)结束',label) and day!=end:warnings.append('date-conflict')
 if r.get('cfpStatus','').startswith('Closes '):
  m=re.search(r'([A-Za-z]{3,9}) (\d{1,2}), (\d{4})',r['cfpStatus'])
  if m and m[1].lower() in MONTHS:
   day=iso(m[3],MONTHS[m[1].lower()],m[2]);milestones.append(dict(label='Call for proposals',at=day,date=day,kind='deadline',timezone=None))
 location=r['location'];mode='unknown' if r.get('locationConflict') else 'hybrid' if '线上' in location and '线下' in location else 'online' if any(x in location.lower() for x in ['线上','virtual','online']) else 'in-person'
 country,point=geography(location,refs)
 if mode!='in-person':point=None
 record=dict(id=source['id']+'-'+r['sourceId']+('-'+start[:4] if source['id']=='lf' and start else ''),short=r['title'],name=r['title'],rank=None,kind='community',communityType=community_type(r),topic=topic(r['title']+' '+' '.join(r.get('tags',[]))),startsAt=start,endsAt=end,submissionDate=None,notificationDate=None,location=location,countryCode=country,point=point,url=r['url'],updatedAt=None,extended=False,source=source['name'],sourceKey=source['id'],sourceId=r['sourceId'],sourceCategory=r.get('sourceCategory',r.get('listing')),capturedAt=r.get('capturedAt',source['capturedAt']),sourceUpdatedAt=source.get('sourceUpdatedAt'),dateLabel=r['dateLabel'],timezone=r.get('timezone'),milestones=milestones,mode=mode,tags=r.get('tags',[]),warnings=sorted(set(warnings)),cfpStatus=r.get('cfpStatus'),sourcePages=[r.get('sourcePage') or source['url']+'/blob/'+source['sourceCommit']+'/'+r['sourceFile']])
 return record
def build_community(root):
 read=lambda p:json.loads((root/p).read_text());geo=read('data/reference/conferences/locations.json');sources=[];records=[]
 for i,c in enumerate(read('data/reference/conferences/community-city-references.json')['cities']):geo['locations']['community-ref-'+str(i)]={'countryCode':c['country'],'point':c['point']}
 for path in ['data/sources/community-deadlines/snapshot.json','data/sources/linuxfoundation-events.json']:
  data=read(path);validate_snapshot(data)
  if data['source']['id']=='osd':
   for name,digest in data['sha256'].items():
    file='LICENSE.txt' if name=='LICENSE' else name.removeprefix('data/')
    assert hashlib.sha256((root/'data/sources/community-deadlines'/file).read_bytes()).hexdigest()==digest,'OSD source hash mismatch'
  source=data['source'];sources.append({**source,'count':len(data['records'])});records.extend(normalize(r,source,geo['locations']) for r in data['records'])
 # Source URL + exact event date identify the same edition; no fuzzy name merging.
 merged={}
 for r in records:
  key=(canonical(r['url']),r['startsAt'] or r['id'])
  if key in merged:
   target=merged[key];target.setdefault('aliases',[]).append(r['id']);target['sourcePages']=sorted(set(target['sourcePages']+r['sourcePages']))
  else:merged[key]=r
 return list(merged.values()),sources

def validate_snapshot(data):
 assert data['schemaVersion']==1 and 0<len(data['records'])<=4000
 source=data['source'];assert source['id'] in ['osd','lf'];safe_url(source['url']);date.fromisoformat(source['capturedAt'])
 ids=set()
 for r in data['records']:
  for k in ['sourceId','title','dateLabel','location']:assert isinstance(r[k],str) and 0<len(r[k])<500
  assert re.fullmatch(r'[\w.-]+',r['sourceId']);safe_url(r['url']);start,end=date_range(r['dateLabel'])
  identity=(r['sourceId'],start[:4] if start else r.get('year'));assert identity not in ids,'Duplicate source edition';ids.add(identity)
  assert isinstance(r.get('tags',[]),list) and len(r.get('tags',[]))<100 and all(isinstance(t,str) and len(t)<100 for t in r.get('tags',[]))
  assert isinstance(r.get('timeline',[]),list) and len(r.get('timeline',[]))<=100
  for m in r.get('timeline',[]):assert isinstance(m.get('comment'),str) and len(m['comment'])<500 and isinstance(m.get('deadline'),str) and len(m['deadline'])<100
  if source['id']=='osd':assert r['sourceFile'] in ['data/activities.yml','data/competitions.yml','data/conferences.yml']
  else:assert r['sourcePage'] in ['https://events.linuxfoundation.org/about/calendar/','https://events.linuxfoundation.org/about/community/']
