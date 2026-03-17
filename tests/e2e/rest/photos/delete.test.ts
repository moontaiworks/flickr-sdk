import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createFlickr } from "#index.js";
import { userCredentials } from "#tests/config.js";

const flickr = createFlickr(userCredentials);
let photoId: string;

beforeAll(async () => {
  const uploadResponse = await flickr.upload({
    photo: new File(
      [await readFile(resolve("tests/assets/0001.jpg"))],
      "0001.jpg",
      { type: "image/jpeg" },
    ),
  });
  photoId = uploadResponse.photoid;
});

it("should success response", async () => {
  const response = await flickr.photos.delete({ photoId });

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
