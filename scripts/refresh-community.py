"""At most seven public requests; no detail crawl. Offline builds do not require PyYAML."""
import datetime,hashlib,importlib.util,json,sys,urllib.request
from pathlib import Path
import community_sources as adapter
ROOT=Path(__file__).resolve().parents[1]
def get(url,limit=1500000):
 request=urllib.request.Request(url,headers={'User-Agent':'OpenDipper-community-sync/1.0 (+https://github.com/X-lab2017/open-dipper)'})
 with urllib.request.urlopen(request,timeout=30) as response:payload=response.read(limit+1)
 if len(payload)>limit:raise ValueError('Oversized source')
 return payload
def write_validated(root,pending,builder):
 files=[*pending,'public/data/conferences.json'];previous={p:(root/p).read_bytes() for p in files}
 try:
  for p,b in pending.items():(root/p).write_bytes(b)
  result=builder();(root/'public/data/conferences.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 except Exception:
  for p,b in previous.items():(root/p).write_bytes(b)
  raise
def refresh():
 import yaml
 day=datetime.datetime.now(datetime.timezone.utc).date().isoformat();folder='data/sources/community-deadlines/'
 old=json.loads((ROOT/folder/'snapshot.json').read_text());old_lf=json.loads((ROOT/'data/sources/linuxfoundation-events.json').read_text());pending={}
 branch=json.loads(get('https://api.github.com/repos/hust-open-atom-club/open-source-deadlines/branches/main',100000));sha=branch['commit']['sha'];base='https://raw.githubusercontent.com/hust-open-atom-club/open-source-deadlines/'+sha+'/'
 license_bytes=get(base+'LICENSE',10000)
 if license_bytes!=(ROOT/folder/'LICENSE.txt').read_bytes():raise ValueError('Upstream license changed; maintainer review required')
 records=[];hashes={'LICENSE':hashlib.sha256(license_bytes).hexdigest()};blobs={'LICENSE':hashlib.sha1(('blob '+str(len(license_bytes))+'\0').encode()+license_bytes).hexdigest()}
 for name in ['activities','competitions','conferences']:
  path='data/'+name+'.yml';payload=get(base+path,500000);records.extend(adapter.parse_deadlines(yaml.safe_load(payload),path));pending[folder+name+'.yml']=payload;hashes[path]=hashlib.sha256(payload).hexdigest();blobs[path]=hashlib.sha1(('blob '+str(len(payload))+'\0').encode()+payload).hexdigest()
 if len(records)<len(old['records'])/2:raise ValueError('Unexpected source contraction')
 source={**old['source'],'sourceCommit':sha,'sourceUpdatedAt':branch['commit']['commit']['committer']['date'],'capturedAt':day}
 pending[folder+'snapshot.json']=dict(schemaVersion=1,source=source,sha256=hashes,records=records)
 pending[folder+'provenance.json']=dict(sourceCommit=sha,sourceUpdatedAt=source['sourceUpdatedAt'],capturedAt=day,gitBlobs=blobs)
 # Retain past LF editions when the public upcoming listing rolls forward.
 current=[];pages=[]
 for path,listing in [('about/calendar/','calendar'),('about/community/','community')]:
  url='https://events.linuxfoundation.org/'+path;payload=get(url);rows=adapter.parse_lf(payload.decode(),url,listing);current.extend(rows);pages.append(dict(url=url,sha256=hashlib.sha256(payload).hexdigest(),count=len(rows)))
 key=lambda r:(r['sourceId'],adapter.date_range(r['dateLabel'])[0][:4])
 prior={key(r):r for r in old_lf['records']};combined={**prior}
 for r in current:
  previous=prior.get(key(r));r['capturedAt']=previous.get('capturedAt',old_lf['source']['capturedAt']) if previous and {k:v for k,v in previous.items() if k!='capturedAt'}==r else day;combined[key(r)]=r
 lf=dict(schemaVersion=1,source={**old_lf['source'],'capturedAt':day},pages=pages,records=list(combined.values()))
 pending['data/sources/linuxfoundation-events.json']=lf
 if records==old['records']:
  pending={k:v for k,v in pending.items() if not k.startswith(folder)}
 comparable=lambda r:{k:v for k,v in r.items() if k!='capturedAt'}
 if [comparable(r) for r in lf['records']]==[comparable(r) for r in old_lf['records']]:pending.pop('data/sources/linuxfoundation-events.json')
 if not pending:print('Community records unchanged; capture timestamps retained.');return
 pending={k:v if isinstance(v,bytes) else (json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode() for k,v in pending.items()}
 spec=importlib.util.spec_from_file_location('conferences',ROOT/'scripts/build-conferences.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 write_validated(ROOT,pending,module.build)
 print('Community sources refreshed:',len(records),'OSD,',len(current),'current LF listings; history retained.')
if __name__=='__main__':
 try:refresh()
 except Exception as error:print('::warning::Community refresh failed; last good snapshot retained:',type(error).__name__,str(error)[:150])
