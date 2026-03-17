import { createFlickr } from "#index.js";
import { systemCredentials } from "#tests/config.js";

it("should success response", async () => {
  const flickr = createFlickr(systemCredentials);
  const response = await flickr.test.echo({ hello: "world" });

  expect(response).toStrictEqual({
    api_key: process.env.FLICKR_CONSUMER_KEY!,
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
