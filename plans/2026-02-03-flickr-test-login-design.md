# Flickr Test Login API Design

## Overview

Add a REST wrapper for `flickr.test.login` that accepts OAuth credentials and optional open parameters, then returns a normalized response with a plain string `username`.

## Goals

- Provide a typed `login` wrapper under `src/apis/rest/test/`.
- Accept open `params` for future optional fields without changing the API.
- Normalize the XML parser output so `username` is a string.

## Non-Goals

- No new authentication flows or token exchange helpers.
- No additional endpoints beyond `flickr.test.login`.

## API Surface

- `login(options, params?)` where:
  - `options` includes `oauth: OAuthOptions` (consumer key/secret and user token/secret).
  - `params` is an open record merged into `{ method: "flickr.test.login" }`.
- Export a `LoginResponse` type for consumers.

## Data Flow

1. Build params: `{ method: "flickr.test.login", ...params }`.
2. Call `requestRestXML` with OAuth options.
3. Normalize raw response by lifting `user.username.#text` to `user.username`.
4. Return the normalized `LoginResponse`.

## Error Handling

- Delegate XML parse errors and Flickr error responses to `requestRestXML`.
- `login` remains a thin wrapper without extra error branching.

## Testing

- Add a unit test that stubs `requestRestXML` and asserts:
  - `login` passes `method: "flickr.test.login"` and OAuth options.
  - `login` returns normalized `username` as a string.
- Avoid live network calls in tests.

## Files

- Add: `src/apis/rest/test/login.ts`
- Add: `src/apis/rest/test/login.spec.ts`
