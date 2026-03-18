import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { flickr, flickrWithAuth, userCredentials } from "#tests/config.js";

let photoId: string;
let photosetId: string;

beforeAll(async () => {
  const uploadResponse = await flickrWithAuth.upload({
    photo: new File(
      [await readFile(resolve("tests/assets/0001.jpg"))],
      "0001.jpg",
      { type: "image/jpeg" },
    ),
  });
  photoId = uploadResponse.photoid;
  const createResponse = await flickrWithAuth.photosets.create({
    primaryPhotoId: photoId,
    title: "photosets.delete",
  });
  photosetId = createResponse.photoset.id;
});

// when all photos in the photoset are deleted, the photoset will be
// automatically deleted.
afterAll(async () => flickrWithAuth.photos.delete({ photoId }));

it("should success response", async () => {
  const response = await flickr.photosets.delete(
    { photosetId },
    userCredentials,
  );

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
