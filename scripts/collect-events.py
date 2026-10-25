"""Bounded public event collectors. No geocoding, invented timestamps, or feed HTML in output."""
import json, os, re, hashlib, time, datetime as dt, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from pathlib import Path
from email.utils import parsedate_to_datetime
ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {'release','security','foundation','policy','community','research'}
NOW = lambda: dt.datetime.now(dt.timezone.utc)
def stamp(): return NOW().isoformat().replace('+00:00','Z')
def iso(s):
    try:
        d=dt.datetime.fromisoformat(s.replace('Z','+00:00'))
    except (ValueError,AttributeError):
        try: d=parsedate_to_datetime(s)
        except Exception: return None
    if not d.tzinfo: return None
    return d.astimezone(dt.timezone.utc).isoformat().replace('+00:00','Z')
def clean(s,limit=450):
    import html
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s or ''))).strip()[:limit]
def safe_url(s):
    p=urllib.parse.urlparse(s or '')
    return s if p.scheme in ('http','https') and p.netloc else ''
def event(source,title,summary,date,url,**extra):
    when=iso(date)
    if not when or not safe_url(url): return None
    return dict(id=hashlib.sha256(url.encode()).hexdigest()[:20],title=clean(title,200),summary=clean(summary),category=source['category'],severity='info',occurredAt=when,collectedAt=stamp(),source=source['name'],sourceId=source['id'],sourceUrl=url,repository=source.get('repository'),provenance='automatic',location=None,reviewStatus='source-published',tags=[source['name']],**extra)
def release_events(source,raw):
    data=json.loads(raw)
    if not isinstance(data,list): raise ValueError('release list expected')
    return [e for r in data if not r.get('draft') and not r.get('prerelease') for e in [event(source,f"{source['name']} · {r.get('name') or r['tag_name']}",r.get('body',''),r.get('published_at',''),r['html_url'])] if e]
def rss_events(source,raw):
    root=ET.fromstring(raw)
    items=root.findall('.//item') or root.findall('{http://www.w3.org/2005/Atom}entry')
    def field(item,n):
        f=item.find(n)
        if f is None:f=item.find('{http://www.w3.org/2005/Atom}'+n)
        return (f.text or f.attrib.get('href','')) if f is not None else ''
    return [e for r in items[:40] for e in [event(source,field(r,'title'),field(r,'description') or field(r,'summary'),field(r,'pubDate') or field(r,'published') or field(r,'updated'),field(r,'link'))] if e]
def valid_manual(e):
    if not isinstance(e,dict) or not e.get('title') or not e.get('summary') or e.get('category') not in CATEGORIES or not iso(e.get('occurredAt','')) or not safe_url(e.get('sourceUrl')):return False
    loc=e.get('location')
    if loc is not None:
        if not isinstance(loc,dict) or not all(k in loc for k in ('lon','lat','name','countryCode','precision')):return False
        if not isinstance(loc['lon'],(float,int)) or not isinstance(loc['lat'],(float,int)) or not -180<=loc['lon']<=180 or not -90<=loc['lat']<=90:return False
    return e.get('severity','info') in ('info','important','critical')
def manual_events(source,raw):
    rows=json.loads(raw)
    if not isinstance(rows,list):raise ValueError('issues list expected')
    out=[]
    for issue in rows:
        if 'pull_request'in issue: continue
        if not issue.get('_approval_valid'):continue
        # A maintainer applies event-approved; valid JSON is treated as data only.
        match=re.search(r'```json\s*(\{[\s\S]*?\})\s*```',issue.get('body') or '')
        if not match:continue
        try:e=json.loads(match.group(1))
        except json.JSONDecodeError:continue
        if not valid_manual(e):continue
        out.append(dict(id=f"manual-{issue['number']}",title=clean(e['title'],200),summary=clean(e['summary']),titleEn=clean(e.get('titleEn',''),200),category=e['category'],severity=e.get('severity','info'),occurredAt=iso(e['occurredAt']),collectedAt=stamp(),source=clean(e.get('source','人工审核'),100),sourceId=source['id'],sourceUrl=e['sourceUrl'],repository=clean(e.get('repository',''),150),provenance='manual',location=e.get('location'),reviewStatus='reviewed',tags=['editor-reviewed'],reviewUrl=issue['html_url']))
    return out
def fetch(url):
    headers={'User-Agent':'OpenDipper/1.0 (+https://github.com/X-lab2017/open-dipper)','Accept':'application/json, application/rss+xml, application/atom+xml, application/xml;q=0.9'}
    # Credential is sent only to the fixed GitHub API origin.
    if urllib.parse.urlparse(url).netloc=='api.github.com' and os.getenv('GITHUB_TOKEN'):headers['Authorization']='Bearer '+os.environ['GITHUB_TOKEN']
    with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=20) as r:
        raw=r.read(4_000_001)
        if len(raw)>4_000_000:raise ValueError('source exceeds 4 MB limit')
        return raw
def review_is_current(issue,history):
    approvals=[x for x in history if x.get('event')=='labeled' and x.get('label',{}).get('name')=='event-approved']
    latest=max((iso(x.get('created_at','')) or '' for x in approvals),default='')
    updated=iso(issue.get('updated_at',''))
    return bool(latest and updated and updated<=latest)
def verify_approvals(source,raw):
    issues=json.loads(raw)
    for issue in issues:
        issue['_approval_valid']=False
        if 'pull_request'in issue:continue
        # Issue edits/comments after approval require re-applying the label.
        endpoint=source['url'].split('?')[0]+'/'+str(int(issue['number']))+'/events?per_page=100'
        history=json.loads(fetch(endpoint))
        issue['_approval_valid']=review_is_current(issue,history)
    return json.dumps(issues)
def collect():
    config=json.loads((ROOT/'config/sources.json').read_text())
    dest=ROOT/'public/data/events.json'
    previous=json.loads(dest.read_text()) if dest.exists() else {'events':[],'sources':[]}
    records={e['id']:e for e in previous['events']};statuses=[];cutoff=NOW()-dt.timedelta(days=config['retentionDays'])
    for source in config['sources']:
        prior=next((s for s in previous['sources'] if s['id']==source['id']),{})
        s=dict(id=source['id'],name=source['name'],url=source['url'],kind=source['kind'],lastAttempt=stamp(),lastSuccess=prior.get('lastSuccess'),count=0,status='ok')
        try:
            parser={'github-releases':release_events,'rss':rss_events,'github-issues':manual_events}[source['kind']]
            raw=fetch(source['url'])
            if source['kind']=='github-issues':raw=verify_approvals(source,raw)
            rows=parser(source,raw)
            # Manual queue is authoritative. Closing/unlabelling retracts an event.
            # On retrieval failure previous reviewed records remain, with stale status.
            if source['kind']=='github-issues':records={k:v for k,v in records.items() if v.get('sourceId')!=source['id']}
            for e in rows:
                if e['id'] in records:e['collectedAt']=records[e['id']]['collectedAt']
                records[e['id']]=e
            s.update(lastSuccess=stamp(),count=len(rows))
        except Exception as ex:s.update(status='stale' if s['lastSuccess'] else 'error',error=str(ex)[:180],count=sum(e.get('sourceId')==source['id'] for e in records.values()))
        statuses.append(s);print(source['id'],s['status'],s['count']);time.sleep(.15)
    events=[e for e in records.values() if iso(e['occurredAt']) and cutoff<=dt.datetime.fromisoformat(iso(e['occurredAt']).replace('Z','+00:00'))<=NOW()]
    payload=dict(schemaVersion=1,generatedAt=stamp(),retentionDays=config['retentionDays'],events=sorted(events,key=lambda e:e['occurredAt'],reverse=True)[:2000],sources=statuses)
    dest.parent.mkdir(parents=True,exist_ok=True);temp=dest.with_suffix('.tmp');temp.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n');temp.replace(dest)
if __name__=='__main__':collect()
