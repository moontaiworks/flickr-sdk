import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import createUploadEndpoint from "#apis/upload/upload.js";
import { userCredentials } from "#tests/config.js";

import createPhotosDelete from "../delete.js";
import createEndpoint from "./check-tickets.js";

describe("single photo", () => {
  let photoId: string;
  let ticketId: string;

  beforeAll(async () => {
    const uploadResponse = await createUploadEndpoint()(
      {
        async: true,
        photo: new File(
          [await readFile(resolve("tests/assets/0001.jpg"))],
          "0001.jpg",
          { type: "image/jpeg" },
        ),
      },
      userCredentials,
    );
    ticketId = uploadResponse.ticketid;
  });

  it("should success response", async () => {
    const response = await createEndpoint()(
      { tickets: [ticketId] },
      userCredentials,
    );

    expect(response).toStrictEqual({
      stat: "ok",
      uploader: {
        ticket: {
          complete: expect.any(String) as string,
          id: expect.any(String) as string,
          imported: expect.any(String) as string,
          photoid: expect.any(String) as string,
        },
      },
    });

    photoId = response.uploader.ticket.photoid;
  });

  afterAll(async () => createPhotosDelete(userCredentials)({ photoId }));
});
