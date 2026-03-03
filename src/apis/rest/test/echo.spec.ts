import { default as endpoint } from "./echo.js";

it("should success response", async () => {
  const response = await endpoint(
    { hello: "world" },
    {
      consumerKey: process.env.FLICKR_CONSUMER_KEY!,
      consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
    },
  );

  expect(response).toStrictEqual({
    api_key: process.env.FLICKR_CONSUMER_KEY!,
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
