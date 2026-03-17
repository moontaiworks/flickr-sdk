import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createPhotosDeleteEndpoint from "#apis/rest/photos/delete.js";
import { userCredentials } from "#tests/config.js";

import createEndpoint from "./upload.js";

let photoId: string;

it("should success response", async () => {
  const endpoint = createEndpoint();
  const response = await endpoint(
    {
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
      ),
    },
    userCredentials,
  );

  expect(response).toStrictEqual({
    photoid: expect.any(String) as string,
    stat: "ok",
  });

  photoId = response.photoid;
});

afterAll(async () =>
  createPhotosDeleteEndpoint()({ photoId }, userCredentials),
);
