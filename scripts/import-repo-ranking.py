#!/usr/bin/env python3
"""Capture the public OpenShare Global / Repo monthly ranking, without geocoding.

URL construction follows OpenShare's public leaderboard client. No credentials are
used. A repo influence ranking is not a region-by-region inventory of code assets.
"""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--month', default='2026-09')
parser.add_argument('--cache', type=Path, help='Captured raw JSON instead of network')
args = parser.parse_args()
if not re.fullmatch(r'20\d{2}-(0[1-9]|1[0-2])', args.month):
    parser.error('Use YYYY-MM')
year, month = args.month.split('-')
url = f'https://selfoss.open-digger.cn/open_leaderboard/global/repo/month/{year}{int(month)}/data.json'
raw = args.cache.read_bytes() if args.cache else urllib.request.urlopen(url, timeout=40).read()
rows = json.loads(raw)['data']
assert rows and all(isinstance(r['openrank'], (int, float)) for r in rows)
assert len({(r['platform'], r['id']) for r in rows}) == len(rows)
assert all(r['rank'] == i + 1 for i, r in enumerate(rows))
assert all(i == 0 or r['openrank'] <= rows[i - 1]['openrank'] for i, r in enumerate(rows))
# Do not silently use a new geographic field without defining its semantics.
assert all('longitude' not in r and 'latitude' not in r for r in rows)
snapshot = {
    'schemaVersion': 1,
    'sourceUrl': f'https://open-share.com/insight/open-leaderboard?scope=Global&unit=Repo&timeType=month&time={args.month}&search=&page=1',
    'dataUrl': url,
    'retrievedAt': dt.datetime.now(dt.timezone.utc).date().isoformat(),
    'sha256': hashlib.sha256(raw).hexdigest(),
    'period': [f'{year}.{month} · 全球仓库 Top {len(rows)}', f'{args.month} · global repository top {len(rows)}'],
    'note': [
        f'公开榜单快照；按 OpenRank 排序。{len(rows)} 条是榜单范围，不是全球仓库总量。源数据未提供地域字段，暂不据此生成地域数量气泡。',
        f'Public ranking snapshot ordered by OpenRank. The {len(rows)} entries define leaderboard coverage, not the global repository population. No geographic fields are supplied, so these rows do not generate regional count bubbles.'
    ],
    'rows': rows,
}
output = Path(__file__).resolve().parents[1] / 'public/data/repo-ranking.json'
output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
print(f'Captured {len(rows)} repository ranks for {args.month}; regional counts left unavailable.')
