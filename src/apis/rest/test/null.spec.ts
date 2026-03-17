import { userCredentials } from "#tests/config.js";

import createEndpoint from "./null.js";

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint(userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
