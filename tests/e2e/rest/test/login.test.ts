import { createFlickr } from "#index.js";
import { userCredentials } from "#tests/config.js";

it("should success response", async () => {
  const flickr = createFlickr(userCredentials);
  const response = await flickr.test.login();

  expect(response).toStrictEqual({
    stat: "ok",
    user: {
      id: process.env.FLICKR_USER_ID!,
      path_alias: "",
      username: process.env.FLICKR_USERNAME!,
    },
  });
});
