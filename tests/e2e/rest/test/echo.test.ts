import { flickr } from "#tests/config.js";

it("should success response", async () => {
  const response = await flickr.rest.test.echo({ hello: "world" });

  expect(response).toStrictEqual({
    api_key: process.env.FLICKR_CONSUMER_KEY!,
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
