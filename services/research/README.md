# DSH research adapter — deployment pilot

This directory is server code, never bundled into Pages. The public 1.13 review has no configured service: the Run button is disabled, and the separately opened full report is labelled editorial. No real DSH/model run has been performed. Adapter tests use explicit injected test doubles; they do not establish upstream runtime compatibility.

## SDK contract

Reviewed DeepSeek Harness commit `22ddee3792402c3e70ec5f86a63c3e3e895a2f60`:
- https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/sdk/client/README.md
- https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/sdk/client/src/types.ts

`DeepSeekHarness` owns a subprocess, `run()` returns `sessionId` and `finalResponse`, and cancellation closes the runtime. The adapter creates a disposable working directory, passes the exact selected source excerpts and closes the runtime on completion/error/timeout. It rejects missing/out-of-range numeric citations; that validation does not verify factual correctness. One run at a time; 180-second timeout and 8,000-token output cap per model request. This is not a total spending cap.

At review time the public npm registry reported SDK `0.0.1-rc.1`, while the inspected upstream source declares `0.2.1-rc.3`. Do not silently install the older package against this adapter. Build the pinned official source following its instructions and set `DSH_SDK_MODULE` to its built SDK client module, or validate a matching published release before selecting it. The SDK and DSH runtime must use matching versions.

## Provisioning still required

Run under a dedicated isolated service account/container. Configure the model in a dedicated DSH home. Supply an operator-reviewed `sdk` profile patch that disables shell/process, arbitrary filesystem, browser/network, external MCP, subagents and other non-research tools for the initial excerpt-only pilot. The patch is a required deployment input; this repository does not claim a prompt instruction is a sandbox. Do not use `sdk-minimal`: upstream documents unrestricted shell access for that profile. Verify tool inventory and denied-operation tests before enabling public requests.

Required server environment (values not committed):

- `DSH_SDK_MODULE`: absolute file URL of the matching built SDK module.
- `DSH_HOME`: dedicated configured Harness home (contains private model settings/session logs).
- `DSH_RESEARCH_PATCH`: absolute path to the reviewed restrictive profile patch.
- `DSH_PROVIDER`, `DSH_MODEL`: configured model route.
- `RESEARCH_GATEWAY_TOKEN`: internal proxy-to-gateway bearer secret.
- `RESEARCH_ALLOWED_ORIGIN`: exact deployed frontend origin.
- `PORT`: optional, default 8787.

Start with `node services/research/server.mjs`. It binds only to 127.0.0.1 and refuses missing configuration. An authenticated HTTPS reverse proxy must validate the user's session, enforce CSRF/access/rate limits and inject the internal bearer token; never forward untrusted authorization headers as the proxy credential. Put the API behind the frontend's same origin; set `VITE_DSH_GATEWAY` to that API prefix at frontend build time. Pages alone cannot host this Node process. Do not enable cross-origin public access without a separately reviewed authentication/CORS deployment. No accounts, proxy, billing, cloud storage or retention scheduler are provisioned by this change.

`POST /research`: `{question, sources:[{id,title,excerpt,url,date,captured,dateBasis}], language}`. Successful response: `{engine:'dsh',status:'completed',sessionId,report,completedAt,sourceIds,reviewStatus:'unreviewed'}`. No fake progress or fixture fallback. Disconnect closes the SDK runtime; the frontend abort does not itself prove a remote shutdown. Runtime shutdown is awaited before workspace removal. Session logs in DSH_HOME require operator retention policy.

Before connecting: run SDK handshake/model smoke test, restricted-tool tests, a real case with source checks, cancellation/disconnect tests and proxy authentication tests. Record model, source revision, actual execution receipt and limits. Only then configure `VITE_DSH_GATEWAY` for deployment.
