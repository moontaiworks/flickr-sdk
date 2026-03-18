import { flickr, userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const response = await flickr.test.null(userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
