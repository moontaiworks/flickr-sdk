import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface PhotosetsCreateParams {
  /**
   * A description of the photoset. May contain limited html.
   */
  description?: string;
  /**
   * The id of the photo to represent this set. The photo must belong to the
   * calling user.
   */
  primaryPhotoId: string;
  /**
   * A title for the photoset.
   */
  title: string;
}
export interface PhotosetsCreateResponse {
  photoset: {
    /**
     * The id of the photoset.
     * @example "72177720304407041"
     */
    id: string;
    /**
     * The url to the photoset page.
     * @example "https://www.flickr.com/photos/moontai0724/sets/72177720304407041/"
     */
    url: string;
  };
}

export default function createPhotosetsCreate(optionsDefault?: GeneralOptions) {
  /**
   * Create a new photoset for the calling user.
   *
   * @requires `write` permission
   *
   * @see https://www.flickr.com/services/api/flickr.photosets.create.html
   */
  return async function (
    payload: PhotosetsCreateParams,
    options?: GeneralOptions,
  ) {
    return ky
      .post<PhotosetsCreateResponse>("rest", {
        context: { ...optionsDefault, useOAuth: true, ...options },
        searchParams: {
          description: payload.description,
          method: "flickr.photosets.create",
          primary_photo_id: payload.primaryPhotoId,
          title: payload.title,
        },
      })
      .then((response) => response.json());
  };
}
