import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export interface PhotosDeleteParams {
  photoId: string;
}
export type PhotosDeleteResponse = FlickrOkResponse;

/**
 * Delete a photo from flickr.
 *
 * @requires permission `delete`
 *
 * @see https://www.flickr.com/services/api/flickr.photos.delete.html
 */
export default async function photosDelete(
  payload: PhotosDeleteParams,
  options?: GeneralOptions,
) {
  return ky
    .post<PhotosDeleteResponse>("rest", {
      context: { useOAuth: true, ...options },
      searchParams: {
        method: "flickr.photos.delete",
        photo_id: payload.photoId,
      },
    })
    .then((response) => response.json());
}
