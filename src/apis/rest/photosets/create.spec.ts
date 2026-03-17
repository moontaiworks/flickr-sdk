import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createUploadEndpoint from "#apis/upload/upload.js";
import { userCredentials } from "#tests/config.js";

import createPhotosDelete from "../photos/delete.js";
import createEndpoint from "./create.js";

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
});

afterAll(async () => createPhotosDelete(userCredentials)({ photoId }));

it("should success response", async () => {
  const response = await createEndpoint()(
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
