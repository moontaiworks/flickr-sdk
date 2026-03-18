import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  flickrWithAuth,
  systemCredentials,
  userCredentials,
} from "#tests/config.js";

import createReplaceEndpoint from "./replace.js";

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
}, 60000);

afterAll(async () => flickrWithAuth.photos.delete({ photoId }));

it("should success response", async () => {
  const response = await createReplaceEndpoint()(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0032.jpg"))],
        "0032.jpg",
        { type: "image/jpeg" },
      ),
      photoId: photoId,
    },
    { ...systemCredentials, ...userCredentials },
  );

  expect(response).toStrictEqual({
    originalSecret: expect.any(String) as string,
    photoId: expect.any(String) as string,
    secret: expect.any(String) as string,
  });
});
