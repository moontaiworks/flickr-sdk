import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createUploadEndpoint from "#apis/upload/upload.js";
import { userCredentials } from "#tests/config.js";

import createPhotosDelete from "../photos/delete.js";
import createPhotosetsCreate from "./create.js";
import createEndpoint from "./delete.js";

let photoId: string;
let photosetId: string;

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
  const createResponse = await createPhotosetsCreate()(
    {
      primaryPhotoId: photoId,
      title: "photosets.delete",
    },
    userCredentials,
  );
  photosetId = createResponse.photoset.id;
});

// when all photos in the photoset are deleted, the photoset will be
// automatically deleted.
afterAll(async () => createPhotosDelete()({ photoId }, userCredentials));

it("should success response", async () => {
  const response = await createEndpoint()({ photosetId }, userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
