# Current product screenshots

Seven production-browser captures from **2026-10-27**, application **1.6.0**: Atlas, AI Radar and Open Galaxy in both themes, plus the World-tour company stop. See [manifest.json](manifest.json) for source commit, dimensions, bytes and SHA-256. Images retain the complete 1363 × 936 viewport and visible scope/simulation labels. Capture time is not the observation period.

The homepages use `<picture>` to select light or dark and load only that variant. Each image is an optimized progressive JPEG, quality 84, 4:4:4 chroma, with no label, layout or data edits. Each is under 210 KB. This reduces transfer size; it cannot guarantee that GitHub or a user's network never interrupts an image request.

The previous 18 historical images totaled **9,209,853 bytes**. Seven current captures total **1,295,626 bytes**, a **85.9% reduction** in tracked screenshot bytes at this path. The former images remain byte-exact at commit `ae3da3e0fa00a3ef7167b8d26a3196d7c1fdd0bc`; historical documents link to those immutable originals. The manifest preserves each original path, size, fingerprint and recovery URL. No Git history was rewritten; a full-history clone still contains the old images.

For future refreshes: capture the released UI, record source revision and date, preserve scope labels, compress to roughly 200 KB, inspect at native size, update both homepage editions and the manifest together, then run `npm run docs:build` and `npm run docs:check`. Generated browser QA images remain ignored. Official SVGs and historical baseline fingerprints are not compression targets.
