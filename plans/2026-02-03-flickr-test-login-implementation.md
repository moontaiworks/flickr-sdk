# Flickr Test Login Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `flickr.test.login` REST wrapper that accepts OAuth credentials and open params, returning a normalized `username` string.

**Architecture:** Implement a thin `login` wrapper in `src/apis/rest/test/login.ts` that calls `requestRestXML`, then normalize the parsed XML shape into a cleaner response type. Add a unit test that mocks `requestRestXML` to keep tests offline and deterministic.

**Tech Stack:** TypeScript, Vitest, ky-based REST XML client

### Task 1: Add a Failing Unit Test

**Files:**

- Create: `src/apis/rest/test/login.spec.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";

import { requestRestXML } from "#utils/request/request-rest-xml.js";
import { login } from "./login.js";

vi.mock("#utils/request/request-rest-xml.js", () => ({
  requestRestXML: vi.fn(),
}));

describe("login", () => {
  it("normalizes username and forwards params", async () => {
    const requestRestXMLMock = vi.mocked(requestRestXML);
    requestRestXMLMock.mockResolvedValue({
      stat: "ok",
      user: { id: "12037949754@N01", username: { "#text": "Bees" } },
    });

    const oauth = {
      consumerKey: "key",
      consumerSecret: "secret",
      token: "token",
      tokenSecret: "tokenSecret",
    };

    const response = await login({ oauth }, { extra: "value" });

    expect(requestRestXMLMock).toHaveBeenCalledWith({
      oauth,
      params: { method: "flickr.test.login", extra: "value" },
    });

    expect(response).toEqual({
      stat: "ok",
      user: { id: "12037949754@N01", username: "Bees" },
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/apis/rest/test/login.spec.ts`

Expected: FAIL with error about `./login.js` not found or `login` not exported.

**Step 3: Commit**

```bash
git add src/apis/rest/test/login.spec.ts
git commit -S -m "test: add login normalization coverage"
```

### Task 2: Implement `login` Wrapper

**Files:**

- Create: `src/apis/rest/test/login.ts`

**Step 1: Write minimal implementation**

```ts
import type { OAuthOptions } from "#utils/request/request-rest-xml.js";
import { requestRestXML } from "#utils/request/request-rest-xml.js";

interface LoginOptions {
  oauth: OAuthOptions;
}

interface LoginResponseRaw {
  stat: "ok";
  user: {
    id: string;
    username: { "#text": string };
  };
}

export interface LoginResponse {
  stat: "ok";
  user: {
    id: string;
    username: string;
  };
}

function normalizeLoginResponse(response: LoginResponseRaw): LoginResponse {
  return {
    stat: response.stat,
    user: {
      id: response.user.id,
      username: response.user.username["#text"],
    },
  };
}

export async function login<
  const R extends Record<PropertyKey, boolean | number | string | undefined>,
>(options: LoginOptions, params?: R): Promise<LoginResponse> {
  const requestParams = {
    method: "flickr.test.login",
    ...params,
  };

  const response = await requestRestXML<LoginResponseRaw>({
    oauth: options.oauth,
    params: requestParams,
  });

  return normalizeLoginResponse(response);
}
```

**Step 2: Run test to verify it passes**

Run: `pnpm test src/apis/rest/test/login.spec.ts`

Expected: PASS.

**Step 3: Commit**

```bash
git add src/apis/rest/test/login.ts
git commit -S -m "feat: add flickr.test.login wrapper"
```

### Task 3: Optional Export Check

**Files:**

- Modify (if needed): `src/index.ts`

**Step 1: Verify whether the project expects exports**

If public exports are required, add:

```ts
export * as test from "./apis/rest/test/login.js";
```

Otherwise skip.

**Step 2: Run targeted tests**

Run: `pnpm test src/apis/rest/test/login.spec.ts`

Expected: PASS.

**Step 3: Commit (only if change applied)**

```bash
git add src/index.ts
git commit -S -m "chore: export test login"
```
