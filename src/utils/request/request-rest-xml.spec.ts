/// <reference types="node" />

import { describe, expect, it } from "vitest";

import { buildRestRequestConfig } from "./request-rest-xml";

describe("buildRestRequestConfig", () => {
  it("adds api_key when consumerSecret is missing", async () => {
    const config = await buildRestRequestConfig({
      oauth: { consumerKey: "key" },
      params: { method: "flickr.test.echo" },
    });

    const params = new URLSearchParams(config.searchParams);
    expect(params.get("api_key")).toBe("key");
    const headers = config.headers as undefined | { Authorization?: string };
    expect(headers?.Authorization).toBeUndefined();
  });

  it("adds OAuth Authorization header when consumerSecret is present", async () => {
    const config = await buildRestRequestConfig({
      oauth: {
        consumerKey: "dpf43f3p2l4k3l03",
        consumerSecret: "kd94hf93k423kf44",
        nonce: "kllo9940pd9333jh",
        timestamp: "1191242096",
        token: "nnch734d00sl2jdk",
        tokenSecret: "pfkkdhi9sl3r4s00",
      },
      params: { method: "flickr.test.echo" },
    });

    const headers = config.headers as undefined | { Authorization?: string };
    expect(headers?.Authorization).toContain("OAuth ");
  });
});
