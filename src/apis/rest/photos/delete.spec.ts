import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createUploadEndpoint from "#apis/upload/upload.js";
import { userCredentials } from "#tests/config.js";

import createEndpoint from "./delete.js";

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

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint({ photoId }, userCredentials);

  expect(response).toStrictEqual({
    stat: "ok",
  });
});
