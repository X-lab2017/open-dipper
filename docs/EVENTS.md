# Event contract v1

`public/data/events.json` is the observed feed. `public/data/demo.json` is a separate fixed simulation fixture. One never substitutes for the other on failure.

```json
{
  "id": "stable-url-hash-or-manual-issue-id",
  "title": "A verifiable publication title",
  "summary": "Plain text summary",
  "category": "release",
  "severity": "info",
  "occurredAt": "2026-10-25T00:00:00Z",
  "collectedAt": "2026-10-25T00:10:00Z",
  "source": "Publisher",
  "sourceUrl": "https://example.org/original-record",
  "sourceId": "configured-source-id",
  "repository": "owner/repository",
  "provenance": "automatic",
  "location": null,
  "reviewStatus": "source-published",
  "tags": ["topic"]
}
```

- Category: `release`, `security`, `foundation`, `policy`, `community`, `research`.
- Severity: `info`, `important`, `critical`; automated topic classification defaults to information, not risk scoring.
- Provenance: `automatic`, `manual`, `demo`.
- Review: `source-published`, `reviewed`, `demo`. Automatic retrieval does not imply manual verification.
- Optional `titleEn` / `summaryEn`; untranslated publications retain original text.
- Location: null or `{name, nameEn?, lon, lat, countryCode, precision}`. ISO3 codes and finite valid coordinates. Precision is `editor-provided` or `simulated`, with documented values for future adapters. No inferred headquarters/IP location.
- Optional `reviewUrl` connects a manual event to its issue.

Root fields: schemaVersion 1, generatedAt, retentionDays, events and sources. Source records include URL, kind, actual attempt/success timestamps, status (ok/stale/error), parsed count and optional error. Parsed count can exceed retained count because retention is applied later.

## Editorial input

An open approved issue contains a fenced JSON object with title, summary, category, severity, occurredAt, source, sourceUrl and location. It must carry event-approved, and its latest update must not be newer than its approval-label event. Changes require reapproval. Invalid timestamps/coordinates and non-HTTP(S) links are rejected.

The UI prepares a submission URL, but the visitor reviews and submits through GitHub. Maintainer approval remains a separate action.
