import createEndpoint from "./login.js";

it("should success response", async () => {
  const endpoint = createEndpoint();
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
    user: {
      id: process.env.FLICKR_USER_ID!,
      path_alias: "",
      username: process.env.FLICKR_USERNAME!,
    },
  });
});
