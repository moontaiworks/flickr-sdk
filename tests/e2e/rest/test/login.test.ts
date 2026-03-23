import { flickr, userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const response = await flickr.rest.test.login(undefined, userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
    user: {
      id: process.env.FLICKR_USER_ID!,
      path_alias: "",
      username: process.env.FLICKR_USERNAME!,
    },
  });
});
