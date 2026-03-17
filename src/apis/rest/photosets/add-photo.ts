import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export interface PhotosetsAddPhotoParams {
  /**
   * The id of the photo to add to the set.
   */
  photoId: string;
  /**
   * The id of the photoset to add a photo to.
   */
  photosetId: string;
}
export type PhotosetsAddPhotoResponse = FlickrOkResponse;

export default function createPhotosetsAddPhoto(
  optionsDefault?: GeneralOptions,
) {
  /**
   * Add a photo to the end of an existing photoset.
   *
   * @requires `write` permission
   *
   * @see https://www.flickr.com/services/api/flickr.photosets.addPhoto.html
   */
  return async function (
    payload: PhotosetsAddPhotoParams,
    options?: GeneralOptions,
  ) {
    return ky
      .post<PhotosetsAddPhotoResponse>("rest", {
        context: { ...optionsDefault, useOAuth: true, ...options },
        searchParams: {
          method: "flickr.photosets.addPhoto",
          photo_id: payload.photoId,
          photoset_id: payload.photosetId,
        },
      })
      .then((response) => response.json());
  };
}
