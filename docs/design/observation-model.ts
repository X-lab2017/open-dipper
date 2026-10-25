/**
 * RFC reference types, not a deployed API or runtime validator.
 * Review: docs/OBSERVATION_LAYERS.md, issue #22. No production imports.
 * IDs are stable internal identities; upstream identities remain namespaced.
 * Date strings, references, cardinality and semantic compatibility require
 * runtime validation in the future adapter; TypeScript alone proves none of them.
 */
export type Id = string;
export type Localized = { en: string; zh: string };
export type EntityKind = 'developer_account' | 'organization' | 'platform_account'
  | 'project' | 'repository' | 'model' | 'dataset' | 'facility' | 'paper' | 'application';
export type DataStatus = 'observed' | 'derived' | 'demo';
export type ReviewStatus = 'source_only' | 'reviewed' | 'disputed';
export type Time =
  | { kind: 'instant'; at: string }
  | { kind: 'interval'; start: string; end: string }
  | { kind: 'trailing_year'; start: null; end: null }
  | { kind: 'unknown'; reason: string };
/** null endpoints mean unknown, not an unbounded claim of validity. */
export type Validity = { from: string | null; until: string | null };
export interface Evidence {
  sourceSnapshotId: Id;
  locator: string; // JSON pointer, document section, or line reference
  basis: 'source_statement' | 'corroborated' | 'inferred' | 'unknown';
  explanation: string;
  reviewStatus: ReviewStatus;
}
export interface SourceSnapshot {
  id: Id;
  url: string; // runtime: HTTP(S) only
  retrievedAt: string;
  publishedAt: string | null;
  version: string | null;
  contentHash: { algorithm: 'sha256' | 'git_blob_sha1'; value: string } | null;
  rights: { status: 'documented' | 'pending'; reference: string | null };
  health: 'ok' | 'stale' | 'error';
}
export interface Entity {
  id: Id;
  kind: EntityKind;
  subtype: string | null;
  names: Localized;
  identifiers: { namespace: string; value: string; valid: Validity }[];
  aliases: string[];
  evidence: Evidence[];
  valid: Validity;
  supersedes: Id | null;
}
export interface Taxon {
  id: Id;
  scheme: 'technology' | 'application_domain' | 'organization_type' | 'actor_role' | 'project_type';
  names: Localized;
  parentIds: Id[];
  upstreamLabelId: string | null;
  evidence: Evidence[];
}
export interface Classification {
  entityId: Id;
  taxonId: Id;
  valid: Validity;
  evidence: Evidence[];
}
export interface Relation {
  id: Id;
  fromId: Id;
  predicate: 'label_association' | 'has_repository' | 'published_by'
    | 'maintained_by' | 'owned_by' | 'member_of' | 'platform_identity'
    | 'derived_from' | 'trained_on' | 'operated_by';
  toId: Id;
  valid: Validity;
  recordedAt: string;
  supersedes: Id | null;
  evidence: Evidence[];
}
export type GeoRole = 'developer_location' | 'organization_headquarters'
  | 'organization_office' | 'project_attribution' | 'publisher_attribution'
  | 'facility_location' | 'event_occurrence' | 'policy_jurisdiction' | 'mentioned_region';
export interface RegionRef {
  namespace: string; // ISO, upstream division ID, or a documented local jurisdiction
  rawCode: string;
  canonicalId: Id | null;
  displayGroupId: Id | null; // presentation grouping, never a summation instruction
}
export type Spatial =
  | { kind: 'region'; region: RegionRef; geometryVersion: string | null;
      precision: 'country' | 'admin1' | 'admin2' | 'municipality' | 'other' }
  | { kind: 'point'; longitude: number; latitude: number;
      precision: 'exact_public_site' | 'approximate_site'; uncertaintyMeters: number | null }
  | { kind: 'unknown'; reason: string };
export interface GeographyAssertion {
  id: Id;
  subjectId: Id;
  role: GeoRole;
  location: Spatial;
  valid: Validity;
  recordedAt: string;
  evidence: Evidence[];
  supersedes: Id | null;
}
export type Subject = 'developer' | 'organization' | 'code_project' | 'model' | 'dataset' | 'facility';
/** Keep scores separate even when each upstream calls them OpenRank. */
export type MetricBySubject = {
  developer: 'developer_stock' | 'developer_openrank_contribution' | 'normalized_community_openrank';
  organization: 'organization_count';
  code_project: 'project_openrank_influence' | 'project_count';
  model: 'model_repository_count' | 'model_downloads';
  dataset: 'dataset_repository_count' | 'dataset_downloads';
  facility: 'facility_count' | 'it_capacity_mw' | 'grid_capacity_mw';
};
export type MetricId = MetricBySubject[Subject];
export type MetricDefinition = {
  [S in Subject]: {
    id: MetricBySubject[S];
    subject: S;
    unit: 'accounts' | 'organizations' | 'projects' | 'repositories' | 'downloads' | 'score' | 'facilities' | 'MW';
    method: { description: string; reference: string | null; version: string | null };
    aggregation: 'upstream_only' | 'deduplicated_count' | 'documented_sum' | 'recompute_ratio';
    comparabilityKey: string; // platform + algorithm + scope + time rules
  }
}[Subject];
export interface Population {
  id: Id;
  subject: Subject;
  platforms: string[];
  scope: 'source_aggregate' | 'curated_sample' | 'platform_snapshot';
  selection: string;
  deduplication: string | null;
  exclusions: string[];
  knownTotal: number | null;
  unlocatedTotal: number | null;
  coverage: string;
}
export type MeasureValue =
  | { status: 'present'; value: number }
  | { status: 'missing'; value: null; reason: 'not_reported' | 'out_of_scope' | 'suppressed' | 'failed' | 'unknown' };
export interface Observation {
  id: Id;
  metricId: MetricId;
  populationId: Id;
  group: { geoRole: GeoRole; region: RegionRef | null; entityId: Id | null; taxonIds: Id[] };
  value: MeasureValue;
  period: Time;
  evidence: Evidence[];
  dataStatus: DataStatus;
  recordedAt: string;
  supersedes: Id | null;
}
export interface SourceDocument {
  id: Id;
  kind: 'news' | 'official_notice' | 'release' | 'research' | 'policy_text';
  sourceSnapshotId: Id;
  url: string;
  title: string;
  language: string | null;
  publishedAt: string | null;
  mentions: { entityId: Id; locator: string }[];
  // Mentioned place is not an occurrence or policy applicability assertion.
  geographyAssertionIds: Id[];
}
export interface Event {
  id: Id;
  kind: 'release' | 'security' | 'foundation' | 'community' | 'research' | 'policy' | 'facility_change';
  entityIds: Id[];
  occurred: Time;
  geographyAssertionIds: Id[];
  documentIds: Id[];
  dataStatus: DataStatus;
  reviewStatus: ReviewStatus;
  mergedInto: Id | null;
  withdrawnAt: string | null;
}
export type PolicyStatus = 'proposed' | 'enacted' | 'restrictions_added' | 'permanent_ban' | 'expired' | 'rejected' | 'lifted';
export type FacilityStatus = 'planned' | 'construction' | 'operational' | 'suspended' | 'closed';
export type EventTransition = {
  id: Id; eventId: Id; effectiveAt: string | null; recordedAt: string;
  evidence: Evidence[]; supersedes: Id | null;
} & (
  | { target: 'policy'; status: PolicyStatus; jurisdictionAssertionIds: Id[] }
  | { target: 'facility'; status: FacilityStatus; facilityId: Id }
);
export interface OpennessAssessment {
  entityId: Id;
  licenseId: string | null;
  materials: ('code' | 'weights' | 'training_recipe' | 'training_data' | 'documentation')[];
  assessment: 'not_assessed' | 'documented';
  framework: string | null;
  frameworkVersion: string | null;
  conclusion: string | null;
  evidence: Evidence[];
}
export type Readiness = 'existing_adapter' | 'planned' | 'source_needed';
export type FilterKey = 'region' | 'organization' | 'organization_type' | 'technology'
  | 'project_type' | 'platform' | 'openness' | 'facility_status';
type GeoBySubject = {
  developer: 'developer_location';
  organization: 'organization_headquarters' | 'organization_office';
  code_project: 'project_attribution';
  model: 'publisher_attribution';
  dataset: 'publisher_attribution';
  facility: 'facility_location';
};
export type MetricLayer = {
  [S in Subject]: {
    kind: 'metric'; subject: S; metric: MetricBySubject[S]; geoRole: GeoBySubject[S];
  }
}[Subject];
export type EventLayer = { kind: 'event'; subject: 'event'; metric: null;
  geoRole: 'event_occurrence' | 'policy_jurisdiction' | 'mentioned_region' };
export type LayerDefinition = (MetricLayer | EventLayer) & {
  id: Id;
  names: Localized;
  navigationGroup: Subject | 'overlays';
  populationId: Id | null;
  sourceRef: string;
  period: Time;
  geographicMeaning: Localized;
  coverageNote: Localized;
  // Static design availability; runtime freshness is independent.
  readiness: Readiness;
  adapterPath: string | null;
  availableFilters: FilterKey[];
  proposedFilters: FilterKey[];
  rendering: 'choropleth' | 'clustered_points' | 'jurisdiction_outline';
  timeControl: 'none' | 'observation_period' | 'event_window' | 'policy_effective_at';
};
