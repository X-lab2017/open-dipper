/** Source snapshots and explicit simulation contracts. No Date.now-based data freshness. */
export type DashboardSnapshot={
 checkedAt:string;
 upstream:{url:string;pageUrl:string;sha256:string;period:{start:string;endExclusive:string;reportYear:number};summary:{totalCountries:number;totalDevelopers:number;totalRepos:number;totalRecords:number;activeDevelopers:number;updatedAt:string;dataSource:string}};
 activeRepositories:{value:number;platforms:Record<string,number>;period:[string,string];scope:[string,string];sourceUrl:string;sourceAsset:string;sourceSha256:string};
 intelligence:{value:number;synthetic:true;scope:[string,string]};
 gitScenario:{year:number;annualProjectedCommits:number;previousYearLowerBound:number;source:string;status:string;scope:[string,string]};
};
export const dashboardMetricKeys=['developers','git','repositories','intelligence'] as const;
export type DashboardMetric=typeof dashboardMetricKeys[number];
export const DEMO_START=66000;
export const REFRESH_MS=2200;
/** Deterministic positive increments; presentation fixtures, not extrapolated observations. */
export function simulatedGrowth(clock:number):Record<DashboardMetric,number>{
 const n=Math.max(0,Math.floor((clock-DEMO_START)/REFRESH_MS));
 return {developers:n*137+Math.floor(n/5)*79,git:n*977+Math.floor(n/4)*33,repositories:n*113+Math.floor(n/3)*13,intelligence:n+Math.floor(n/4)};
}
/** Linear calendar-year scenario anchored to the captured review date, not the user's clock. */
export function gitScenarioBaseline(s:DashboardSnapshot){
 const start=Date.UTC(s.gitScenario.year,0,1),end=Date.UTC(s.gitScenario.year+1,0,1);
 const asOf=Date.parse(s.checkedAt+'T00:00:00Z');
 return Math.floor(s.gitScenario.annualProjectedCommits*Math.max(0,Math.min(1,(asOf-start)/(end-start))));
}
export function dashboardPulse(s:DashboardSnapshot,clock:number){
 const base={developers:s.upstream.summary.activeDevelopers,git:gitScenarioBaseline(s),repositories:s.activeRepositories.value,intelligence:s.intelligence.value};
 const growth=simulatedGrowth(clock),previous=simulatedGrowth(clock-REFRESH_MS);
 return Object.fromEntries(dashboardMetricKeys.map(k=>[k,{value:base[k]+growth[k],base:base[k],growth:growth[k],delta:growth[k]-previous[k]}])) as Record<DashboardMetric,{value:number;base:number;growth:number;delta:number}>;
}
