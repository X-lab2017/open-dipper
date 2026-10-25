"""Optional maintainer import: pinned OpenDigger checkout -> auditable label index.
Requires PyYAML for upstream YAML; not part of app/runtime/CI dependencies.
Usage: python3 scripts/extract-label-coverage.py /path/to/open-digger
"""
from pathlib import Path
import sys, json, subprocess, hashlib
import yaml
COMMIT='5c2ffc4f5b3dd37ebcb20514c7abfee6853bd830'
checkout=Path(sys.argv[1]).resolve()
assert subprocess.check_output(['git','-C',str(checkout),'rev-parse','HEAD']).decode().strip()==COMMIT
labels=[]; repos=set(); files=[]
for p in sorted((checkout/'labeled_data').rglob('*.yml')):
    raw=p.read_bytes(); d=yaml.safe_load(raw); kind=d.get('type') or ''
    rel=p.relative_to(checkout).as_posix()
    files.append({'path':rel,'sha256':hashlib.sha256(raw).hexdigest()})
    group={'Company':'company','Foundation':'foundation','Community':'community'}.get(kind)
    if kind.startswith(('University-','Institution-')): group='research'
    if kind.startswith('Agency-'): group='public'
    if group: labels.append({'id':':'+rel.removeprefix('labeled_data/').removesuffix('/index.yml').removesuffix('.yml'),'name':d['name'],'nameZh':d.get('name_zh',d['name']),'type':kind,'group':group,'path':rel,'sha256':hashlib.sha256(raw).hexdigest()})
    for platform in (d.get('data') or {}).get('platforms',[]):
        for repo in platform.get('repos',[]):
            if repo.get('id') is None: raise ValueError('Repository needs a stable upstream ID: '+rel)
            repos.add((platform['name'],str(repo['id'])))
result={'schemaVersion':1,'source':{'repository':'X-lab2017/open-digger','commit':COMMIT,'url':'https://github.com/X-lab2017/open-digger/tree/'+COMMIT+'/labeled_data'},'scope':'Typed organization labels and explicit repository IDs; referenced org inventories are not expanded, legal entities are not deduplicated, labels can be nested. Not a global census.','scannedFiles':len(files),'manifestSha256':hashlib.sha256(json.dumps(files,ensure_ascii=False,sort_keys=True).encode()).hexdigest(),'labels':labels,'repositories':{'count':len(repos),'byPlatform':{platform:sum(1 for p,_ in repos if p==platform) for platform in sorted({p for p,_ in repos})},'identitySetSha256':hashlib.sha256(json.dumps(sorted(repos)).encode()).hexdigest()}}
Path('data/reference/labeled-organizations.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'labels':len(labels),'repositories':len(repos),'files':len(files)}))
