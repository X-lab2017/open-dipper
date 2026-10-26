import {isRegional,pointsFor,type Bundle,type LayerId,type Point} from './layers';
export type RankRow={key:string;rank:number;name:[string,string];value:number;unit:string;region?:Point;entity?:Point};
/** Rankings keep the source order/rank and metric. Unverified coordinates stay null. */
export function rankingRows(id:LayerId,b:Bundle):RankRow[]{
 const cat=id==='code'?b.repoRanking:b.report.catalogs[id];
 if(cat)return cat.rows.map((r:any,i:number)=>{
  const en=r.name??r.company??r.foundation??r.project??r.model_id;
  const zh=r.name_zh??r.company_zh??r.foundation_zh??en;
  const located=pointsFor(id,b).find(p=>p.entityName?.includes(en)||(en==='Stichting NixOS Foundation'&&p.id==='nixos-foundation'));
  const key=`rank-${id}-${r.rank??i+1}`,value=Number(r.openrank??r.modelrank_value),unit=id==='llm'?'ModelRank':'OpenRank';
  const entity:Point=located??{id:key,overlayId:id,country:r.country??'',countryZh:r.country_zh,rawCode:r.country_code??'',longitude:null,latitude:null,entityName:[zh,en],sourceUrls:[cat.sourceUrl],period:cat.period,note:['榜单对象；未核验坐标，不在地图上放置实体点。','Ranked object; coordinates are unverified, so no entity point is mapped.']};
  return {key,rank:Number(r.rank??i+1),name:[zh,en],value,unit,entity:{...entity,metrics:[['Report rank',r.rank??i+1],[unit,value],...(r.participants!=null?[['Participants',r.participants] as [string,number]]:[]),...(r.active_developers!=null?[['Active developers',r.active_developers] as [string,number]]:[])]}};
 });
 if(isRegional(id))return [...pointsFor(id,b)].sort((a,b)=>(b.atlasValue??0)-(a.atlasValue??0)).map((p,i)=>({key:`region-${id}-${p.rawCode}`,rank:i+1,name:[p.countryZh??p.country,p.country],value:p.atlasValue??0,unit:'',region:p}));
 return [];
}
