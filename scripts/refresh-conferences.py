"""Bounded daily public-snapshot sync. No account, detail scraping or event approval."""
import json,urllib.request,importlib.util,datetime
from pathlib import Path
root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('adapter',root/'scripts/build-conferences.py');adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)
def get(url,limit):
 req=urllib.request.Request(url,headers={'User-Agent':'OpenDipper-conference-sync/1.0 (+https://github.com/X-lab2017/open-dipper)'})
 with urllib.request.urlopen(req,timeout=30) as r:
  b=r.read(limit+1)
  if len(b)>limit:raise ValueError('Oversized response')
  return b
try:
 branch=json.loads(get('https://api.github.com/repos/sundou82/conference-partner-mcp/branches/main',100000));sha=branch['commit']['sha']
 payload=get(f'https://raw.githubusercontent.com/sundou82/conference-partner-mcp/{sha}/data/ccf-conferences.json',3000000);raw=json.loads(payload);adapter.validate(raw)
 old=json.loads((root/'data/sources/ccf-conferences.json').read_text())
 if raw['conferences']!=old['conferences']:
  # Assemble before persisting; failure preserves the last good bundle and dates.
  files=['data/sources/ccf-conferences.json','data/reference/conferences/provenance.json','public/data/conferences.json']
  previous={p:(root/p).read_bytes() for p in files}
  try:
   (root/files[0]).write_bytes(payload)
   meta=json.loads(previous[files[1]]);meta.update(sourceCommit=sha,capturedAt=datetime.datetime.now(datetime.timezone.utc).date().isoformat())
   (root/files[1]).write_text(json.dumps(meta,indent=2)+'\n')
   result=adapter.build();(root/files[2]).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  except Exception:
   for p,b in previous.items():(root/p).write_bytes(b)
   raise
  print('Updated conference snapshot:',len(raw['conferences']))
 else:print('Conference records unchanged; preserved provenance timestamp.')
except Exception as e:print('::warning::Conference refresh failed; last good snapshot retained:',type(e).__name__)
