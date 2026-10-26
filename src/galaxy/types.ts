export type GalaxySource = 'code'|'model';
export type GalaxyMode = 'all'|GalaxySource;
export type GalaxyNode = {
 id:string; name:string; x:number; y:number; size:number; community:number|string;
 category:string; kind:string; url:string; description?:string; author?:string;
 language?:string; topics?:string[]; degree?:number; trending?:boolean;
 contributors?:number; openrank?:number; downloads?:number; likes?:number; updatedAt?:string;
};
export type GalaxyEdge = [number,number,number,number,number|null,number];
export type GalaxyMeta = {
 source:GalaxySource; sourceCommit:string; upstreamUrl:string; period?:unknown; snapshotAt?:string;
 nodeCount:number; edgeCount:number; relationTypes:string[]; sizeMetric?:string;
 categories?:Array<{id:string;label:string;count:number}>; scope?:string;
 [key:string]:unknown;
};
export type GalaxyGraph = {meta:GalaxyMeta;nodes:GalaxyNode[];edges:GalaxyEdge[]};
export type GalaxyItem = GalaxyNode & {key:string;source:GalaxySource;index:number;gx:number;gy:number;score:number;colorIndex:number};
export type GalaxyLink = {source:number;target:number;strength:number;kind:string;shared:number|null;inferred:boolean};
export type GalaxyIndex = {
 nodes:GalaxyItem[];edges:GalaxyLink[];byKey:Map<string,number>;neighbors:Map<number,number[]>;
 graphs:Partial<Record<GalaxySource,GalaxyGraph>>;categories:string[];
};
export type GalaxyFilter={mode:GalaxyMode;category:string;kind:string;query:string;inferred:boolean;relation:string;watchedOnly:boolean;language?:string};
export type GalaxyCamera={x:number;y:number;zoom:number};
