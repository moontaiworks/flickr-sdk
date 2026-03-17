import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface PhotosUploadCheckTicketsParams {
  tickets: string[];
}

export type PhotosUploadCheckTicketsResponse =
  | PhotosUploadCheckTicketsResponseDone
  | PhotosUploadCheckTicketsResponseProcessing;

interface PhotosUploadCheckTicketsResponseDone {
  uploader: {
    ticket: {
      complete: "1";
      id: string;
      imported: string;
      photoid: string;
    };
  };
}

interface PhotosUploadCheckTicketsResponseProcessing {
  uploader: {
    ticket: {
      complete: "0";
      id: string;
    };
  };
}

export default function createPhotosUploadCheckTickets(
  optionsDefault?: GeneralOptions,
) {
  /**
   * Checks the status of one or more asynchronous photo upload tickets.
   *
   * @see https://www.flickr.com/services/api/flickr.photos.upload.checkTickets.html
   */
  return async function (
    payload: PhotosUploadCheckTicketsParams,
    options?: GeneralOptions,
  ) {
    return ky
      .post<PhotosUploadCheckTicketsResponse>("rest", {
        context: { ...optionsDefault, ...options },
        searchParams: {
          method: "flickr.photos.upload.checkTickets",
          tickets: payload.tickets.join(","),
        },
      })
      .then((response) => response.json());
  };
}
