/// <reference types="node" />

import { describe, expect, it } from "vitest";

import { buildRestRequestConfig } from "./request-rest-xml";

describe("buildRestRequestConfig", () => {
  it("adds api_key when consumerSecret is missing", () => {
    const config = buildRestRequestConfig({
      oauth: { consumerKey: "key" },
      params: { method: "flickr.test.echo" },
    });

    const params = new URLSearchParams(config.searchParams);
    expect(params.get("api_key")).toBe("key");
    const headers = config.headers as undefined | { Authorization?: string };
    expect(headers?.Authorization).toBeUndefined();
  });
});
