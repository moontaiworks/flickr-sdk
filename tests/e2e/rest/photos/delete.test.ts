import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { flickr, flickrWithAuth, userCredentials } from "#tests/config.js";

let photoId: string;

beforeAll(async () => {
  const uploadResponse = await flickrWithAuth.upload({
    photo: new File(
      [await readFile(resolve("tests/assets/0001.jpg"))],
      "0001.jpg",
      { type: "image/jpeg" },
    ),
  });
  photoId = uploadResponse.photoid;
});

it("should success response", async () => {
  const response = await flickr.photos.delete({ photoId }, userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
