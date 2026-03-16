import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createPhotosDeleteEndpoint from "#apis/rest/photos/delete.js";

import createReplaceEndpoint from "./replace.js";
import createUploadEndpoint from "./upload.js";

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

afterAll(async () => createPhotosDeleteEndpoint()({ photoId }, options));

it("should success response", { timeout: 60000 }, async () => {
  // We have to wait a while for Flickr to update or it will fail to replace
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, 5000),
  );

  const response = await createReplaceEndpoint()(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0032.jpg"))],
        "0032.jpg",
        { type: "image/jpeg" },
      ),
      photoId: photoId,
    },
    options,
  );

  expect(response).toStrictEqual({
    originalSecret: expect.any(String) as string,
    photoId: expect.any(String) as string,
    secret: expect.any(String) as string,
  });
});
