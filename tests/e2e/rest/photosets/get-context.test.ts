import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { flickr, flickrWithAuth } from "#tests/config.js";

let photoIds: string[];
let photosetId: string;

beforeAll(async () => {
  photoIds = await Promise.all(
    ["0001.jpg", "0032.jpg"].map(async (photoName) =>
      flickrWithAuth
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
  const createResponse = await flickrWithAuth.photosets.create({
    primaryPhotoId: photoIds[0],
    title: "photosets.getContext",
  });
  photosetId = createResponse.photoset.id;
  await flickrWithAuth.photosets.addPhoto({
    photoId: photoIds[1],
    photosetId,
  });
});

// when all photos in the photoset are deleted, the photoset will be
// automatically deleted.
afterAll(async () =>
  Promise.all(
    photoIds.map((photoId) => flickrWithAuth.photos.delete({ photoId })),
  ),
);

it("should success response for 1st photo", async () => {
  const response = await flickr.photosets.getContext({
    photoId: photoIds[0],
    photosetId,
  });

  expect(response).toStrictEqual({
    count: "2",
    nextphoto: {
      farm: expect.any(String) as string,
      id: expect.any(String) as string,
      license: expect.any(String) as string,
      media: expect.any(String) as string,
      owner: expect.any(String) as string,
      secret: expect.any(String) as string,
      server: expect.any(String) as string,
      thumb: expect.any(String) as string,
      title: expect.any(String) as string,
      url: expect.any(String) as string,
    },
    prevphoto: { id: "0" },
    stat: "ok",
  });
});

it("should success response for 2nd photo", async () => {
  const response = await flickr.photosets.getContext({
    photoId: photoIds[1],
    photosetId,
  });

  expect(response).toStrictEqual({
    count: "2",
    nextphoto: { id: "0" },
    prevphoto: {
      farm: expect.any(String) as string,
      id: expect.any(String) as string,
      license: expect.any(String) as string,
      media: expect.any(String) as string,
      owner: expect.any(String) as string,
      secret: expect.any(String) as string,
      server: expect.any(String) as string,
      thumb: expect.any(String) as string,
      title: expect.any(String) as string,
      url: expect.any(String) as string,
    },
    stat: "ok",
  });
});
