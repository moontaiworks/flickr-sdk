import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  flickrWithAuth,
  systemCredentials,
  userCredentials,
} from "#tests/config.js";

import upload from "./upload.js";

let photoId: string;

it("should success response", async () => {
  const response = await upload(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
      ),
    },
    { ...systemCredentials, ...userCredentials },
  );

  expect(response).toStrictEqual({
    photoid: expect.any(String) as string,
    stat: "ok",
  });

  photoId = response.photoid;
});

afterAll(async () => flickrWithAuth.rest.photos.delete({ photoId }));
