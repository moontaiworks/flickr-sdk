import { createFlickr } from "#index.js";

it("should success response", async () => {
  const flickr = createFlickr({
    consumerKey: process.env.FLICKR_CONSUMER_KEY!,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
  });
  const response = await flickr.test.echo({ hello: "world" });

  expect(response).toStrictEqual({
    api_key: process.env.FLICKR_CONSUMER_KEY!,
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
