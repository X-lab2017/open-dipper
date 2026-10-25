"""Fixed, reproducible review fixtures. Never refreshed or rebased by the scheduled collector."""
import json,datetime as dt
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
base=dt.datetime(2026,10,24,15,tzinfo=dt.timezone.utc)
scenarios=[
 ('community','社区联合维护者峰会','Community maintainers summit','演示线下社区活动的地点、规模与关联项目。','Berlin',13.4,52.5,'DEU'),
 ('research','开源生态年度研究发布','Annual open-source research','演示研究报告与观测指标的关联入口。','Shanghai',121.47,31.23,'CHN'),
 ('policy','公共部门开源采购倡议','Public-sector open-source initiative','演示公共政策类事件的地域分布与来源核验。','Brussels',4.35,50.85,'BEL'),
 ('security','关键依赖安全响应演练','Dependency security response exercise','演示安全通告定位与优先级；没有实际漏洞或受影响项目。','San Francisco',-122.42,37.77,'USA'),
 ('foundation','跨社区治理协作计划','Cross-community governance programme','演示基金会、项目与维护者协同治理事件。','London',-.12,51.5,'GBR'),
 ('release','开放模型工具链版本发布','Open model toolchain release','演示重大版本发布与项目月度指标联动。','Beijing',116.4,39.9,'CHN'),
 ('community','开发者共创工作坊','Developer collaboration workshop','演示本地社区与开发者活动。','Bengaluru',77.59,12.97,'IND'),
 ('foundation','开源基础设施支持计划','Open infrastructure support programme','演示公益投入、基金会资助与项目协作。','Tokyo',139.69,35.68,'JPN'),
 ('policy','数字公共产品交流会','Digital public goods forum','演示数字公共产品与区域生态事件。','Nairobi',36.82,-1.29,'KEN'),
 ('community','拉美开源社区交流日','Latin American open-source community day','演示区域社区活动聚合。','São Paulo',-46.63,-23.55,'BRA'),
 ('research','开放协作网络研究','Open collaboration network research','演示学术研究与指标解释。','Sydney',151.21,-33.87,'AUS'),
 ('release','开发工具协作版本演示','Developer tool release scenario','演示版本发布地域关联，地点仅为模拟。','Toronto',-79.38,43.65,'CAN'),
 ('community','中国台湾开源社区交流','Taiwan, China community exchange','演示地域呈现，非实际活动。','中国台湾',121.56,25.03,'TWN')]
events=[]
for i,(cat,title,en,summary,city,lon,lat,code) in enumerate(scenarios):
 events.append(dict(id=f'demo-{i+1:02}',title=title,titleEn=en,summary=summary+' 此条为虚构演示，不代表已发生的事实。',summaryEn='Fictional review scenario. This is not a report of a real event.',category=cat,severity='important' if cat in ['security','policy'] else 'info',occurredAt=(base-dt.timedelta(hours=i*6)).isoformat(),collectedAt=base.isoformat(),source='OpenDipper 演示场景',sourceUrl='',repository='',provenance='demo',location=dict(name=city,nameEn=city,lon=lon,lat=lat,countryCode=code,precision='simulated'),reviewStatus='demo',tags=['simulation']))
geo=json.loads((ROOT/'public/data/geography.json').read_text())
countries=[]
for i,c in enumerate(geo['layers'][0]['countries']):
 if c['longitude'] is None:continue
 # Arbitrary synthetic values, not rescaled real OpenDigger measurements.
 seed=sum(ord(s) for s in c['rawCode']);activity=(seed*7919)%90000+500
 countries.append({k:c[k] for k in ['country','countryZh','displayRegionName','rawCode','longitude','latitude']}|dict(developers=(seed*13)%15000,openrank=(seed*83)%8000,activity=activity,change_requests_accepted=(seed*113)%25000))
(ROOT/'public/data/demo.json').write_text(json.dumps(dict(schemaVersion=1,generatedAt=base.isoformat(),kind='simulation',period='2026-09',note='Fixed fictional review scenarios; do not present as observed data.',countries=countries,events=events),ensure_ascii=False,indent=2)+'\n')
