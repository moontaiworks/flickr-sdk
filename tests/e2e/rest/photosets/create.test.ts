import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { flickr, flickrWithAuth, userCredentials } from "#tests/config.js";

let photoId: string;

beforeAll(async () => {
  const uploadResponse = await flickrWithAuth.upload.upload(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
        { type: "image/jpeg" },
      ),
    },
    userCredentials,
  );
  photoId = uploadResponse.photoid;
});

afterAll(async () => flickrWithAuth.rest.photos.delete({ photoId }));

it("should success response", async () => {
  const response = await flickr.rest.photosets.create(
    { primaryPhotoId: photoId, title: "Test Photoset" },
    userCredentials,
  );

  expect(response).toStrictEqual({
    photoset: {
      id: expect.any(String) as string,
      url: expect.any(String) as string,
    },
    stat: "ok",
  });
});
