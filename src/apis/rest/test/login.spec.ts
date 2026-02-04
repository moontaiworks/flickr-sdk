import { describe, expect, it } from "vitest";

import { login } from "./login.js";

describe("login", () => {
  const oauth = {
    consumerKey: process.env.FLICKR_CONSUMER_KEY!,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
    token: process.env.FLICKR_TOKEN!,
    tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
  };
  const expectedUserId = process.env.FLICKR_USER_ID!;
  const expectedUsername = process.env.FLICKR_USERNAME!;

  it("returns user info with real OAuth tokens", async () => {
    const response = await login({ oauth });

    expect(response.stat).toBe("ok");
    expect(response.user.id).toBe(expectedUserId);
    expect(response.user.username).toBe(expectedUsername);
  }, 15000);
});
