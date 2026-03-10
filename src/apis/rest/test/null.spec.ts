import { default as endpoint } from "./null.js";

it("should success response", async () => {
  const response = await endpoint({
    consumerKey: process.env.FLICKR_CONSUMER_KEY!,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
    oauthUser: {
      token: process.env.FLICKR_TOKEN!,
      tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
    },
  });

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
