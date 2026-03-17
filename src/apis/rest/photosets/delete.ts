import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export interface PhotosetsDeleteParams {
  /**
   * The id of the photoset to delete. It must be owned by the calling user.
   */
  photosetId: string;
}
export type PhotosetsDeleteResponse = FlickrOkResponse;

export default function createPhotosetsDelete(optionsDefault?: GeneralOptions) {
  /**
   * Delete a photoset.
   *
   * @requires `write` permission
   *
   * @see https://www.flickr.com/services/api/flickr.photosets.delete.html
   */
  return async function (
    payload: PhotosetsDeleteParams,
    options?: GeneralOptions,
  ) {
    return ky
      .post<PhotosetsDeleteResponse>("rest", {
        context: { ...optionsDefault, useOAuth: true, ...options },
        searchParams: {
          method: "flickr.photosets.delete",
          photoset_id: payload.photosetId,
        },
      })
      .then((response) => response.json());
  };
}
