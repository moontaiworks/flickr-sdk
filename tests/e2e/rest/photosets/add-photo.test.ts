import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { flickr, flickrWithAuth, userCredentials } from "#tests/config.js";

let photoIds: string[];
let photosetId: string;

beforeAll(async () => {
  photoIds = await Promise.all(
    ["0001.jpg", "0032.jpg"].map(async (photoName) =>
      flickrWithAuth.upload
        .upload({
          photo: new File(
            [await readFile(resolve(`tests/assets/${photoName}`))],
            photoName,
            { type: "image/jpeg" },
          ),
        })
        .then((r) => r.photoid),
    ),
  );
  const createResponse = await flickrWithAuth.rest.photosets.create({
    primaryPhotoId: photoIds[0],
    title: "photosets.addPhoto",
  });
  photosetId = createResponse.photoset.id;
});

// when all photos in the photoset are deleted, the photoset will be
// automatically deleted.
afterAll(async () =>
  Promise.all(
    photoIds.map((photoId) => flickrWithAuth.rest.photos.delete({ photoId })),
  ),
);

it("should success response", async () => {
  const response = await flickr.rest.photosets.addPhoto(
    {
      photoId: photoIds[1],
      photosetId,
    },
    userCredentials,
  );

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
