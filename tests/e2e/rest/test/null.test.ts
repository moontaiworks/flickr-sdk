import { createFlickr } from "#index.js";
import { userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const flickr = createFlickr(userCredentials);
  const response = await flickr.test.null();

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
