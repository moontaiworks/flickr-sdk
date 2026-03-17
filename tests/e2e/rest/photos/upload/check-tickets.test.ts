import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createFlickr } from "#index.js";
import { userCredentials } from "#tests/config.js";

const flickr = createFlickr(userCredentials);

describe("single photo", () => {
  let photoId: string;
  let ticketId: string;

  beforeAll(async () => {
    const uploadResponse = await flickr.upload({
      async: true,
      photo: new File(
        [await readFile(resolve("tests/assets/0001.jpg"))],
        "0001.jpg",
        { type: "image/jpeg" },
      ),
    });
    ticketId = uploadResponse.ticketid;
  });

  it("should success response", async () => {
    let response: Awaited<ReturnType<typeof flickr.photos.upload.checkTickets>>;
    do {
      response = await flickr.photos.upload.checkTickets({
        tickets: [ticketId],
      });

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

  afterAll(async () => flickr.photos.delete({ photoId }));
});
