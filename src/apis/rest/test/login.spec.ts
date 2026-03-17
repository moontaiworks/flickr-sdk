import { userCredentials } from "#tests/config.js";

import createEndpoint from "./login.js";

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint(userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
    user: {
      id: process.env.FLICKR_USER_ID!,
      path_alias: "",
      username: process.env.FLICKR_USERNAME!,
    },
  });
});
