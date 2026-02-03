/// <reference types="node" />

import { describe, expect, it } from "vitest";

import { createOAuthAuthorizationHeader } from "./oauth";

const endpoint = "http://photos.example.net/photos";

describe("createOAuthAuthorizationHeader", () => {
  it("creates a valid OAuth header for the RFC example", async () => {
    const header = await createOAuthAuthorizationHeader({
      method: "GET",
      oauth: {
        consumerKey: "dpf43f3p2l4k3l03",
        consumerSecret: "kd94hf93k423kf44",
        nonce: "kllo9940pd9333jh",
        timestamp: "1191242096",
        token: "nnch734d00sl2jdk",
        tokenSecret: "pfkkdhi9sl3r4s00",
      },
      params: new URLSearchParams({
        file: "vacation.jpg",
        size: "original",
      }),
      url: endpoint,
    });

    expect(header).toMatch(/^OAuth /);
    expect(header).toContain('oauth_consumer_key="dpf43f3p2l4k3l03"');
    expect(header).toContain('oauth_token="nnch734d00sl2jdk"');
    expect(header).toContain('oauth_signature_method="HMAC-SHA1"');
    expect(header).toContain(
      'oauth_signature="tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"',
    );
    expect(header).toContain('oauth_timestamp="1191242096"');
    expect(header).toContain('oauth_nonce="kllo9940pd9333jh"');
  });
});
