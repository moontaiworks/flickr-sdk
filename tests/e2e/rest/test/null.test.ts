import { flickr, userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const response = await flickr.rest.test.null(undefined, userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
