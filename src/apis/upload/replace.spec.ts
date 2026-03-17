import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createPhotosDeleteEndpoint from "#apis/rest/photos/delete.js";
import { userCredentials } from "#tests/config.js";

import createReplaceEndpoint from "./replace.js";
import createUploadEndpoint from "./upload.js";

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
    userCredentials,
  );
  photoId = uploadResponse.photoid;
}, 60000);

afterAll(async () =>
  createPhotosDeleteEndpoint()({ photoId }, userCredentials),
);

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
    userCredentials,
  );

  expect(response).toStrictEqual({
    originalSecret: expect.any(String) as string,
    photoId: expect.any(String) as string,
    secret: expect.any(String) as string,
  });
});
