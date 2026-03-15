import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createEndpoint from "./upload.js";

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
      ),
    },
    {
      consumerKey: process.env.FLICKR_CONSUMER_KEY!,
      consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
      oauthUser: {
        token: process.env.FLICKR_TOKEN!,
        tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
      },
    },
  );

  expect(response).toStrictEqual({
    photoid: expect.any(String) as string,
    stat: "ok",
  });
});
