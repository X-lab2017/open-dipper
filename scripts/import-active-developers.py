"""Refresh the active-developer extract from the GOSD report, never stock counts."""
import datetime
import hashlib
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://www.x-lab.info/2026-Global-Open-Source-Development-Report/2026/zh/chapters/02/#ch02-s01'
html = urllib.request.urlopen(URL, timeout=30).read().decode()
match = re.search(r'<script[^>]*id="vmap-data"[^>]*>(.*?)</script>', html, re.S)
if not match:
    raise SystemExit('Report vmap-data unavailable; previous extract is unchanged')
raw = match.group(1)
source = json.loads(raw)
assert source['unit'] == '万人'
assert source['observation_period']['start'] == '2025-07-01'
anchors = {r['code']: r for r in json.loads((ROOT/'public/data/anchors.json').read_text())['rows']}
rows = []
for row in source['countries']:
    if row['active'] is None:
        continue
    anchor = anchors.get(row['id'], {})
    rows.append(dict(code=row['id'], rawCode=anchor.get('rawCode'), name=row['en'], nameZh=row['name'],
                     value=round(row['active'] * 10000), longitude=anchor.get('longitude'), latitude=anchor.get('latitude')))
result = dict(source=dict(url=URL, element='vmap-data', retrievedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                          sha256=hashlib.sha256(raw.encode()).hexdigest(), attribution='GOSD 2026 / OpenDigger / OpenShare · CC BY 4.0'),
              period=source['observation_period'], scope=source['scope'], globalActive=round(source['global_active']*10000),
              globalTotal=round(source['global_total']*10000), rows=rows)
output = ROOT/'public/data/active-developers.json'
temporary = output.with_suffix('.tmp')
temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
temporary.replace(output)
print(f'Imported {len(rows)} regional active-developer observations')
