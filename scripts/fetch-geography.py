#!/usr/bin/env python3
"""Read-only, bounded fetch of three label aggregates and public-domain geography."""
import datetime,hashlib,json,pathlib,time,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]/'public'/'data'
NE_COMMIT='ca96624a56bd078437bca8184e78163e5039ad19'
NE_BASE=f'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/{NE_COMMIT}/geojson/'
LABELS=['companies/microsoft','foundations/apache','foundations/linux_foundation/pytorch']
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00','Z')
def fetch(url):
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'OpenDipper-review-geography/0.1'}),timeout=40) as r:
  raw=r.read(); data=json.loads(raw)
  return data,{'url':url,'fetchedAt':now(),'sha256':hashlib.sha256(raw).hexdigest(),'httpStatus':r.status}
def feature_code(p):return p.get('ISO_A3_EH') if p.get('ISO_A3_EH') not in (None,'-99') else p['ADM0_A3']
def build_index(features):
 index={}
 for f in features:
  p=f['properties']
  for key in ['NAME','NAME_LONG','NAME_EN','ADMIN','BRK_NAME']:
   if p.get(key):index[p[key].casefold()]=p
 aliases={'United States':'United States of America','Korea':'South Korea','Czech Rep.':'Czechia','Dem. Rep. Congo':'Democratic Republic of the Congo','Congo':'Republic of the Congo','Lao PDR':'Laos','Timor-Leste':'East Timor','Swaziland':'eSwatini','Macedonia':'North Macedonia','Bosnia and Herz.':'Bosnia and Herzegovina','Central African Rep.':'Central African Republic','Dominican Rep.':'Dominican Republic','Eq. Guinea':'Equatorial Guinea','S. Sudan':'South Sudan','Solomon Is.':'Solomon Islands'}
 for a,b in aliases.items():
  if b.casefold() in index:index[a.casefold()]=index[b.casefold()]
 return index
def normalize_country(row,index):
 if not isinstance(row.get('country'),str) or any(not isinstance(row.get(k),(int,float)) or isinstance(row[k],bool) or not 0<=row[k]<float('inf') for k in ['developers','openrank']):raise ValueError('Malformed aggregate country row')
 p=index.get(row['country'].casefold());code=feature_code(p) if p else None
 return {'country':row['country'],'countryZh':row.get('country_zh'),'countryIso3':code,'rawCode':code,'displayRegionName':'中国台湾' if code=='TWN' else row.get('country_zh',row['country']),'displayGroup':'CHN' if code=='TWN' else code,'developers':row['developers'],'openrank':row['openrank'],'longitude':p.get('LABEL_X') if p else None,'latitude':p.get('LABEL_Y') if p else None,'coordinateStatus':'matched_label_anchor' if p else 'unmapped','coordinateMethod':'Natural Earth 50m country map-label anchor; not a person or headquarters' if p else None}
def main():
 ROOT.mkdir(parents=True,exist_ok=True)
 outlines,outline_prov=fetch(NE_BASE+'ne_110m_admin_0_countries.geojson');time.sleep(.2)
 anchors,anchor_prov=fetch(NE_BASE+'ne_50m_admin_0_countries.geojson');index=build_index(anchors['features']);time.sleep(.2)
 for f in outlines['features']:
  p=f['properties'];code=feature_code(p)
  f['properties']={'name':p['NAME_EN'],'nameZh':p['NAME_ZH'],'countryIso3':code,'rawCode':code,'displayGroup':'CHN' if code=='TWN' else code,'displayRegionName':'中国台湾' if code=='TWN' else p['NAME_ZH']}
 outlines.pop('bbox',None)
 (ROOT/'countries.geojson').write_text(json.dumps(outlines,separators=(',',':'),ensure_ascii=False)+'\n')
 layers=[]
 for path in LABELS:
  meta,prov=fetch('https://oss.open-digger.cn/'+path+'/meta.json')
  assert meta['type']=='label' and meta['id']==':'+path and isinstance(meta.get('contributions'),list)
  countries=[normalize_country(row,index) for row in meta['contributions']]
  layers.append({'id':meta['id'],'name':meta['name'],'nameZh':meta.get('name_zh'),'labelType':meta.get('label_type'),'metaUpdatedAt':datetime.datetime.fromtimestamp(meta['updatedAt']/1000,datetime.timezone.utc).isoformat().replace('+00:00','Z'),'provenance':prov,'countries':countries,'mappedCountryCount':sum(c['longitude'] is not None for c in countries),'unmappedCountries':[c['country'] for c in countries if c['longitude'] is None]})
  time.sleep(.2)
 result={'schemaVersion':1,'fetchedAt':now(),'semantics':{'platform':'github','metric':'normalized_community_openrank','periodType':'trailing_year_as_implemented_upstream','periodStart':None,'periodEnd':None,'exactPeriodStatus':'not_published_in_meta','monthlyTimelineLinked':False,'unknownCountryCoverage':None,'unknownCountryCoverageStatus':'not_published','geographicMeaning':'按可解析国家字段的贡献者聚合；不是实时位置、国籍或组织总部。未知国家的贡献者不在分布中，缺失覆盖比例未知。','periodLabel':'近一年聚合；精确起止未公开','coverageLabel':'仅有国家字段的 GitHub 贡献者，非全球完整覆盖','edgeStatus':'unavailable','edges':[],'edgeReason':'国家合计不能还原实体间流向或协作边，不生成跨国连线。','labelOverlap':'标签可重叠，禁止跨标签直接求和或推断独立人群。','taxonomy':'保留 OpenDigger 原始国家键与值；Natural Earth 仅提供显示几何与地图锚点。台湾呈现为中国台湾，不修改原始数值。','implementationUrl':'https://github.com/X-lab2017/open-digger/blob/5c2ffc4f5b3dd37ebcb20514c7abfee6853bd830/src/cron/tasks/monthlyExport.ts'},'layers':layers,'outlineAsset':'/data/countries.geojson','geographySource':{'provider':'Natural Earth','attribution':'Made with Natural Earth.','license':'Public domain','licenseUrl':'https://www.naturalearthdata.com/about/terms-of-use/','commit':NE_COMMIT,'outlineProvenance':outline_prov,'anchorProvenance':anchor_prov,'outlineScale':'1:110 million','anchorScale':'1:50 million','boundaryNote':'Natural Earth source boundaries are a cartographic reference, not contributor identity or a claim about sovereignty. Taiwan display grouping is CHN; original code retained.','simplification':'Source coordinates retained; properties reduced for rendering. No geospatial contribution flows.'},'limitations':['独立静态地理聚合，与20仓库的月度指标筛选器无关。','地图锚点来自公开制图标签坐标，不是个人位置或企业总部。','未匹配的国家保留原始值但不放置虚构标记。','OpenDigger 数据再分发条款仍待独立核定，Natural Earth 地图许可与其分开。']}
 (ROOT/'geography.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 for layer in layers:print(layer['name'],len(layer['countries']),'mapped',layer['mappedCountryCount'],'unmapped',layer['unmappedCountries'])
 print('Wrote',ROOT)
if __name__=='__main__':main()
