# Vector-retrieval source pack / 向量检索来源资料包

Prepared for [issue #19](https://github.com/X-lab2017/open-dipper/issues/19). **Editorial proposal, not an approved event or live-site update.**

## Reader and topic / 用户场景与主题

An editor preparing an AI/open-source briefing needs a small, checkable set of original sources before deciding what to cover. These three records concern PostgreSQL vector search, a SQLite extension and a dedicated vector database. They are different deployment building blocks, not a like-for-like ranking. The selection is illustrative, not a complete market inventory.

面向准备 AI 与开源情报样刊的编辑：先核对三个官方发布记录，再决定是否选题。三种组件的部署形态不同，不按发布日期、功能数量或项目描述推断优劣；地点无直接证据，保持未知。

## Three original sources / 三个原始来源

### pgvector v0.8.7

- Primary record / 原始来源: [dated changelog](https://github.com/pgvector/pgvector/blob/f37c13f68b57d2c3472b2214fbcff699d6d34876/CHANGELOG.md).
- Published / 发布: **2026-10-01** (day precision; time and timezone not supplied).
- Project / 项目: [pgvector](https://github.com/pgvector/pgvector); pinned release commit: `f37c13f68b57d2c3472b2214fbcff699d6d34876`.
- Software rights / 软件许可: [PostgreSQL License](https://github.com/pgvector/pgvector/blob/f37c13f68b57d2c3472b2214fbcff699d6d34876/LICENSE); file SHA-256: `6bba9ebeb73e27477463b05e5ef1bf303bccbddb3db9bbc95905d351604d6a87`.
- Source says / 来源内容: The dated 0.8.7 changelog reports fixes for an IVFFlat index-build buffer overflow and the avg aggregate when no rows match.
- Why useful / 选题价值: A useful maintenance source for an editor tracking PostgreSQL-based vector retrieval; it does not establish retrieval quality or production adoption.
- Geography / 地点: unknown / 未知（JSON 为 `null`）.

### sqlite-vec v0.1.9

- Primary record / 原始来源: [official release](https://github.com/asg017/sqlite-vec/releases/tag/v0.1.9).
- Published / 发布: **2026-03-31T08:00:23Z** (UTC, second precision).
- Project / 项目: [sqlite-vec](https://github.com/asg017/sqlite-vec); pinned release commit: `e9f598abfa0c06b328d8fe5da9c3760cce74be10`.
- Software rights / 软件许可: [MIT license file checked](https://github.com/asg017/sqlite-vec/blob/e9f598abfa0c06b328d8fe5da9c3760cce74be10/LICENSE-MIT); file SHA-256: `6ce72bbe12d975bd5286e5ab0a064c069693300c47bccbc57bec18485f1621ea`.
- Source says / 来源内容: The v0.1.9 release reports a correction for DELETE on vec0 tables with long text metadata columns.
- Why useful / 选题价值: A concrete local-database maintenance item for a SQLite vector-search topic; cross-platform or workload performance still needs independent testing.
- Geography / 地点: unknown / 未知（JSON 为 `null`）.

### Qdrant v1.20.0

- Primary record / 原始来源: [official release](https://github.com/qdrant/qdrant/releases/tag/v1.20.0).
- Published / 发布: **2026-10-22T14:14:12Z** (UTC, second precision).
- Project / 项目: [Qdrant](https://github.com/qdrant/qdrant); pinned release commit: `222b2e44ab1c3f17e8246396ead6558e45041df7`.
- Software rights / 软件许可: [Apache-2.0 license file checked](https://github.com/qdrant/qdrant/blob/222b2e44ab1c3f17e8246396ead6558e45041df7/LICENSE); file SHA-256: `210b508429e913d9de5301f90508bc2cbf5b2281de5b45e607c04d58f0f3bd8f`.
- Source says / 来源内容: The v1.20.0 announcement includes BM25 scoring on the full-text payload index and turbo8/turbo16 vector datatypes.
- Why useful / 选题价值: An example of combined text/vector retrieval feature development; the release announcement is evidence of an upstream claim, not an independent benchmark.
- Geography / 地点: unknown / 未知（JSON 为 `null`）.

## Evidence, clocks and limits / 证据、时钟与边界

- The [machine-readable dossier](vector-retrieval-2026-10-26.json) stores the same three records, full commits, license-file fingerprints, retrieval timestamps and explicit null geography. Release dates are not replaced with retrieval dates.
- pgvector does not publish a record at GitHub's latest-release endpoint. Its tagged changelog supplies only **2026-10-01**; no UTC midnight or exact release instant is invented. sqlite-vec and Qdrant dates come from GitHub's `published_at` field.
- These are upstream announcements. No software was installed or benchmarked for this dossier. No latency, recall, reliability, adoption, compatibility or license suitability was independently established. sqlite-vec's March publication is deliberately shown as older than the October records.
- License links identify checked files at the release commits. They do not license all upstream documentation, datasets, services or marks. This pack contains concise original paraphrases and factual identifiers; no source code, image, full announcement or third-party license text is copied. OpenDipper's unresolved application/documentation license remains as stated in [RIGHTS](../RIGHTS.md).
- Maintainers decide usefulness, rights and editorial approval. This contribution does not modify source collectors, approve an event, replace fictional examples or populate any production dataset. Broader integration can be scoped after review.

## Review and disclosure / 检查与 AI 披露

Genesis agent-21, an autonomous AI contributor, gathered the three official records, resolved release tags to full commits, read the pinned license files and checked the extracted fields against those responses. There is no independent human review or upstream acceptance claimed. The release/commit/license links and the JSON are the review surface; downstream editors should recheck mutable release pages before publication.

资料由自主 AI 贡献者整理；事实摘录与选题解释分开。未验证软件运行效果，也未推断地理位置。是否进入样刊、如何接入与是否发布，仍由维护者独立审核。
