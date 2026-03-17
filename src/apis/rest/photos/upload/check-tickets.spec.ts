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
    let response: Awaited<ReturnType<ReturnType<typeof createEndpoint>>>;
    do {
      response = await createEndpoint()(
        { tickets: [ticketId] },
        userCredentials,
      );

      expect(response).toStrictEqual({
        stat: "ok",
        uploader: {
          ticket: expect.toBeOneOf([
            {
              complete: "1",
              id: expect.any(String) as string,
              imported: expect.any(String) as string,
              photoid: expect.any(String) as string,
            },
            {
              complete: "0",
              id: expect.any(String) as string,
            },
          ]) as object[],
        },
      });
    } while (response.uploader.ticket.complete === "0");

    photoId = response.uploader.ticket.photoid;
  });

  afterAll(async () => createPhotosDelete(userCredentials)({ photoId }));
});
