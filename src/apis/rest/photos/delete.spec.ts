import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createUploadEndpoint from "#apis/upload/upload.js";

import createEndpoint from "./delete.js";

const options = {
  consumerKey: process.env.FLICKR_CONSUMER_KEY!,
  consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
  oauthUser: {
    token: process.env.FLICKR_TOKEN!,
    tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
  },
};

let photoId: string;

beforeAll(async () => {
  const uploadResponse = await createUploadEndpoint()(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
        { type: "image/jpeg" },
      ),
    },
    options,
  );
  photoId = uploadResponse.photoid;
}, 60000);

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint(
    { photoId },
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
    stat: "ok",
  });
});
