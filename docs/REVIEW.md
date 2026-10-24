# OpenDipper 0.2 review walkthrough

Start on the panoramic homepage. Check globe rotation, map switching, zoom/reset, country selection, label layers and repository playback. Geography remains a static annual aggregate when the monthly timeline moves. Open Analysis for the checks below.

1. Open the overview. Confirm the banner says sample snapshot, not live. Count 20 repositories across four sample platforms.
2. Change observation month and metric. A dash means no value for that month; latest metric month may be older than entity metadata.
3. Select GitLab. Its full nested namespace remains intact; comparison selection is reconciled to the platform.
4. Change GitLab to new stars and open its evidence: the source was HTTP 404, not a zero count.
5. Use the comparison controls for up to three repositories and switch between 6, 12 and 24 calendar months. Missing months must remain gaps.
6. Search for a nonexistent name and inspect the empty state. Search filters the directory and available choices, not already selected comparison series.
7. Open an evidence drawer. Compare the selected month, metric latest month, meta timestamp and fetch timestamp. Follow the original CDN link if needed.
8. Visit the Evidence tab. Review scope and metric definitions before interpreting rankings.
9. Test light/dark mode, language switch, keyboard focus, Escape dismissal and a narrow mobile viewport.

## Decisions still needed

- Which repositories/categories should replace or expand the fixed review sample?
- Is the overview–comparison–evidence structure suitable for the intended audience?
- What code license should the maintainer apply?
- Data redistribution rights need verification before formal publishing or mirroring.
- Browser/visual acceptance remains pending in a browser environment able to reach the local build.

No accounts, automatic data-refresh schedules, alerts or collaboration graph are included. Geography uses actual aggregate country data, not invented flows. GitHub Pages deployment status must be checked in the repository Actions run.
