# Real geographic layer

Three verified OpenDigger label metadata responses provide aggregate country contributions:

- Microsoft: https://oss.open-digger.cn/companies/microsoft/meta.json
- Apache Software Foundation: https://oss.open-digger.cn/foundations/apache/meta.json
- PyTorch Foundation: https://oss.open-digger.cn/foundations/linux_foundation/pytorch/meta.json

Apache's label ID was discovered in the existing apache/spark repository metadata; PyTorch Foundation's ID was discovered in pytorch/pytorch metadata. The three labels are curated examples, not a complete or non-overlapping worldwide population.

## Meaning and limits

The reviewed upstream implementation aggregates trailing-year GitHub normalized community OpenRank for contributors with a country field. Metadata does not publish an exact start/end interval or the unknown-country denominator; both remain null. Metadata export timestamps are not observation watermarks. This layer is independent of the 20-repository monthly selection and must not move with that timeline.

Country names are source strings; values are not relabeled or redistributed. Countries with no coordinate match remain in the data with null longitude/latitude. Do not insert invented positions. Country totals cannot establish origin/destination, collaboration, migration, dependencies, or other edges: no actual geographic edges are available, and no flow arcs should be created from these totals. Labels may overlap, so do not sum them as independent cohorts.

The geographic result is aggregate data only, with no personal biography or individual position. Natural Earth's published LABEL_X/LABEL_Y map-label anchors (50m) place markers, not organization headquarters, inferred developer coordinates, or mathematically exact centroids. Every aggregate retains its original country key, developers, and openrank values.

## Map asset and license

Made with Natural Earth. All Natural Earth map data is public domain: https://www.naturalearthdata.com/about/terms-of-use/ . This applies to the geometry assets, not automatically to OpenDigger's aggregate data, whose independent redistribution terms remain to be verified.

Source repository pinned at ca96624a56bd078437bca8184e78163e5039ad19:
https://github.com/nvkelso/natural-earth-vector/tree/ca96624a56bd078437bca8184e78163e5039ad19

The 177-feature 110m country GeoJSON provides actual low-resolution outlines. Coordinates are retained; unused properties are removed. The separate 50m country metadata supplies map-label anchors including smaller countries. Both original response URLs, fetch timestamps, and SHA-256 hashes are in geography.json.

Taiwan retains rawCode TWN while displayGroup is CHN and displayRegionName is 中国台湾. That is a presentation grouping only; source contribution keys and numeric values are unchanged. Country boundaries are a cartographic reference, not a statement of contributor nationality or a new political classification. UI should not use the grouping to invent a new total or double count.

## Reproduction and checks

Run python3 scripts/fetch-geography.py to fetch precisely five public JSON files, sequentially with 200ms spacing and 40s timeouts. It requires only the Python standard library. Run node --test tests/geography.test.mjs for offline fixture-integrity checks. No network is needed to review the bundled result.

Observed snapshot: Microsoft 142 source country rows, 139 mapped; Apache 97 rows, 96 mapped; PyTorch Foundation 85 rows, all mapped. Unmatched source labels are Réunion, Cocos (Keeling) Islands, Bouvet Island, and Christmas Island. These missing markers must not imply a zero contribution.
