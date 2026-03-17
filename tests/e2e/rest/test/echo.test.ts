import { createFlickr } from "#index.js";
import { userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const flickr = createFlickr(userCredentials);
  const response = await flickr.test.echo({ hello: "world" });

  expect(response).toStrictEqual({
    api_key: process.env.FLICKR_CONSUMER_KEY!,
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
