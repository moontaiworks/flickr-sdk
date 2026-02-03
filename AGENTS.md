# Agent Notes

- Always sign commits with GPG. If signing fails in this environment, ask the user to run the commit locally.
- REST XML requests now support optional OAuth:
  - `consumerSecret` present → OAuth 1.0a params are appended to the query string.
  - `consumerSecret` missing → falls back to public request and injects `api_key` from `consumerKey`.
- `buildRestRequestConfig` (in `src/utils/request/request-rest-xml.ts`) is async and returns `{ method, searchParams, headers }`.
- OAuth signing is implemented in `src/utils/request/oauth.ts` using `hash-wasm` (HMAC-SHA1) with RFC3986 normalization.
- Test focus: `pnpm test src/utils/request/oauth.spec.ts` and `pnpm test src/utils/request/request-rest-xml.spec.ts`.
- Docs folder is for generated output; avoid adding hand-written notes there. See `notes/2026-02-03-request-rest-xml-oauth.md` for summary.
