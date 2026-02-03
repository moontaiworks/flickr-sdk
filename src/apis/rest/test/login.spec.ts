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
      params: { extra: "value", method: "flickr.test.login" },
    });

    expect(response).toEqual({
      stat: "ok",
      user: { id: "12037949754@N01", username: "Bees" },
    });
  });
});
