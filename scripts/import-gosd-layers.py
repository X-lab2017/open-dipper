"""Rebuild report-derived layers. No simulated rankings/categories are imported."""
import json, re, hashlib, urllib.request, argparse
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE='https://www.x-lab.info/2026-Global-Open-Source-Development-Report/'
parser=argparse.ArgumentParser();parser.add_argument('--cache',help='Optional directory of previously captured source files');args=parser.parse_args()
CACHE=Path(args.cache) if args.cache else None
RETRIEVED=datetime.now(timezone.utc).date().isoformat()
def get(path,cache):
    p=CACHE/cache if CACHE else None
    raw=p.read_bytes() if p and p.exists() else urllib.request.urlopen(BASE+path,timeout=45).read()
    return raw.decode(),{'url':BASE+path,'sha256':hashlib.sha256(raw).hexdigest(),'retrievedAt':RETRIEVED}
def script(path,cache):
    text,source=get(path,cache);return json.JSONDecoder().raw_decode(text[text.index('=')+1:])[0],source
def embedded(text,id):
    return json.loads(re.search(r'<script[^>]*id="'+id+r'"[^>]*>(.*?)</script>',text,re.S).group(1))
html2,s2=get('2026/zh/chapters/02/','gosd-ch02.html')
html3,s3=get('2026/zh/chapters/03/','gosd-ch03.html')
cmap=embedded(html2,'cmap-data');ranking=embedded(html3,'gosr-data')['datasets']
imap,si=script('assets/imap/data.js','report-assets-imap-data.js')
tmap,st=script('assets/tmap/data.js','report-assets-tmap-data.js')
amap,sa=script('assets/amap/publication-data.js','report-assets-amap-publication-data.js')
anchors={r['code']:r for r in json.loads((ROOT/'public/data/anchors.json').read_text())['rows']}
active=json.loads((ROOT/'public/data/active-developers.json').read_text());names={r['code']:r for r in active['rows']}
def row(code,value,zh=None,en=None):
    a=anchors.get(code,{});n=names.get(code,{})
    return {'code':code,'rawCode':a.get('rawCode','unmapped:'+code),'name':en or n.get('name',code),'nameZh':'中国台湾' if code=='TW' else zh or n.get('nameZh',code),'value':value,'longitude':a.get('longitude'),'latitude':a.get('latitude')}
def source(section):return BASE+'2026/zh/chapters/'+section[:2]+'/#ch'+section[:2]+'-s'+section[2:]
D={'schemaVersion':1,'retrievedAt':RETRIEVED,'sourceFiles':[s2,s3,si,st,sa],'areas':{},'catalogs':{}}
def area(id,rows,section,period,scope,note,total=None,status='observed'):
    D['areas'][id]={'rows':rows,'sourceUrl':source(section),'period':period,'scope':scope,'note':note,'status':status,'total':total if total is not None else sum(r['value'] for r in rows)}
area('contribution',[row(r['id'],r['value'],r['name'],r['en']) for r in cmap['countries']],'0202',['2025 自然年','Calendar year 2025'],['已收录地域合计','Observed regional sum'],['采用 C-Map 地域快照，期间以图件内元数据为准。OpenRank 是协作贡献分值，不是人数；不与报告年度序列拼接。','C-Map regional snapshot, using its embedded period. OpenRank measures collaborative contribution, not headcount. Do not splice with report-year series.'])
board=next(x for x in imap['snapshot']['leaderboards'] if 'Project OpenRank' in x['title'])
area('influence',[row(r['code'],r['value'],r['name_zh'],r['name']) for r in board['data']],'0203',['2025 自然年','Calendar year 2025'],['已收录地域合计','Observed regional sum'],['项目地域归属的 OpenRank 分值；与开发者贡献分别计量。统计期间遵循 I-Map 内元数据。','Project-attributed OpenRank, separate from developer contribution. Period follows I-Map embedded metadata.'])
area('talent',[row(r['code'],r['value'],r['name']) for r in tmap['world']],'0204',['2026.07 快照','July 2026 snapshot'],['已收录地域样本','Observed regional sample'],['沿用源表个人全域 OpenRank 前 5% 样本。累计窗口、基准总体与并列处理待补；地域表不用于推算全球总量，也不展示个人位置。','Source-defined top 5% by personal global OpenRank. Accumulation window, reference population and ties remain unspecified. No global extrapolation or individual locations.'])
for id in ['models','datasets']:
    a=amap['assets'][id]
    area(id,[row(r['id'],r['count'],r['name']) for r in a['countries']],'0205',['累计样本 · 时点未披露','Cumulative sample · date undisclosed'],['发布单位累计样本','Cumulative publisher sample'],['报告发布单位累计样本；当前图件列出 14 个地域，其合计小于样本总量。地域按发布者归属，不代表训练或部署地点；公开可见不等于开源许可。','Cumulative publisher sample. The figure lists 14 regions whose sum is below its sample total. Publisher attribution is not training or deployment location; public visibility is not an open-source license.'],a['total'])
area('code',[],'0205',['2026 报告年度','2026 report year'],['GitHub 活跃仓库总量','Global active GitHub repositories'],['报告给出 GitHub 活跃仓库总量 6,328,640，但未提供同口径地域分布。暂不绘制气泡，不将项目影响力或开发者数量当作代码资产数量。','The report provides 6,328,640 active GitHub repositories, without a matching regional distribution. No bubbles are inferred from project influence or developer counts.'],amap['platforms']['GitHub'][-1],'geography-pending')
area('content',[],'0205',['待补充','Pending'],['地域数据待补','Regional data pending'],['文档、教程、知识库等内容资产的去重标识、许可、归属与地域统计待共建；报告未提供可直接使用的地域表。','Content assets need identifiers, deduplication, licenses, attribution and regional observations. No directly usable regional table is provided.'],0,'pending')
D['areas']['content']['total']=None
for layer,table,section in [('companies','company','0302'),('foundations','foundation','0303'),('benchmark','project','0304'),('emerging','newProject','0305'),('llm','models','0306')]:
    D['catalogs'][layer]={'sourceUrl':source(section),'period':['2026.08 快照','August 2026 snapshot'] if layer=='llm' else ['2025.07—2026.06','Jul 2025–Jun 2026'],'rows':ranking[table]['rows'],'note':['仅报告原表；未导入模拟补位。位置需独立证据，未定位记录保留在清单。','Original report table only; simulated extensions excluded. Locations require separate evidence; unlocated records stay in the catalog.']}
(ROOT/'public/data/report-layers.json').write_text(json.dumps(D,ensure_ascii=False,separators=(',',':'))+'\n')
print({k:len(v['rows']) for k,v in D['areas'].items()})
