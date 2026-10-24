# OpenDipper review snapshot

This is a small, fixed, curated evaluation sample, not a global leaderboard, random sample, or representative population. It contains 17 GitHub repositories across several ecosystems and one contract-validation example from GitLab, Gitee, and AtomGit. No full repository CSV, personal biographies, inferred locations, or private data are bundled.

## Source and refresh

Source: OpenDigger public CDN, https://oss.open-digger.cn/ . Metric usage documentation: https://open-digger.cn/docs/user_docs/metrics/metrics_usage_guide . The reviewed exporter implementation is https://github.com/X-lab2017/open-digger/blob/5c2ffc4f5b3dd37ebcb20514c7abfee6853bd830/src/cron/tasks/monthlyExport.ts ; that commit is a research reference, not a verified production version.

Run `node scripts/fetch-data.mjs` from the repository root using Node 20 or newer. The self-authored refresh script makes only public JSON GET requests: 20 entities × (6 metrics + metadata), with a maximum concurrency of 4, 150 ms between each worker's requests, and 20 second request timeouts. There are no retries, credentials, writes to upstream, third-party dependencies, or bulk CSV downloads. It replaces the review snapshot including observed failures; keep the version-controlled prior snapshot if a refresh is unsuitable. No network is required to run the bundled UI or tests.

Run `node --test tests/data.test.mjs` for deterministic synthetic contract tests and bundled-snapshot integrity tests.

## Schema v1

- Root: schemaVersion, startedAt, fetchedAt, selection, metrics, repositories, limitations, source.
- Metric definition: id, label, definition, definitionUrl. Six IDs: openrank, activity, participants, contributors, stars, change_requests_accepted.
- Repository: key, platform, path, name, category, identity, metaUpdatedAt, metaStatus, metaProvenance, metrics.
- Identity: platform, entityType (`repo`), id (verified metadata string or null), status (`resolved` or `unresolved`), key. Verified key is platform + entity type + ID. Without valid metadata, key explicitly uses `unresolved-path`; no identifier is invented. Paths are aliases and preserve nested GitLab namespaces.
- Series: status (`ok`, `empty`, `not_exported`, `fetch_error`, `invalid`), latestMonth (last valid monthly observation or null), points, invalidMonths, reason, provenance.
- Point: month (`YYYY-MM`), value (finite non-negative number), flags. Explicit zero is retained. Missing months are absent, not zero. Annual, quarterly and raw-suffix keys never become monthly observations. Invalid monthly values are excluded and their month keys are listed.
- Window: each metric independently retains actual observations within the 24 calendar months ending at its own latest valid month. Sparse series may have far fewer than 24 points. A stale metric can have a different window than another metric for the same entity.
- `2021-10` is flagged `potential_interpolation` whenever it falls inside that metric's window, because upstream documents interpolation for that period. `2021-10-raw` is not substituted into the displayed series.
- Provenance: exact source URL, fetchedAt, HTTP status, SHA-256 of successful raw JSON UTF-8 body, and Last-Modified where available. Hashes refer to original full responses, not the normalized display window. No raw response archive is bundled.
- metaUpdatedAt is an ISO timestamp of the metadata export, not an observation watermark. It must never replace latestMonth or imply complete upstream ingestion.

## Observed coverage, 2026-10-24

All 20 entity metadata responses resolved IDs. Of 120 metric requests, 115 produced usable monthly series, four returned valid JSON without monthly observations (facebook/react participants, contributors, stars, accepted change requests), and GitLab stars returned HTTP 404. `not_exported` means no public JSON at that URL, not a nonexistent project or a zero value.

Examples of differing metric freshness: OpenDigger accepted-change/contributor series end at 2026-06; Apache Spark at 2025-03; Go at 2022-08; React OpenRank/activity at 2026-05; GitLab example at 2026-08; Gitee OpenRank/activity at 2025-10 while its stars end at 2025-12. Many other sample metrics end at 2026-09. These are observed contents, not a diagnosis of inactivity, migration, outage, or platform-wide coverage. Source data may be corrected later.

Do not merge cross-platform rankings, sum scores across platforms, or interpret different event coverage as comparable performance. Comparisons must use one platform, one metric, and the same explicitly selected month; absent values stay unavailable. The snapshot carries no claim of real-time events, geographic attribution, causal explanation, or supply-chain edges.

## Rights caveat

OpenDigger's code license does not establish the license for all underlying platform data or exported results. Independent data redistribution/commercial-use terms remain to be verified. This small public-source review snapshot includes provenance; it is not a grant of rights or a declaration of legal clearance. No repository LICENSE is selected by this data layer.
