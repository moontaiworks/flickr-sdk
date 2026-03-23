import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export interface PhotosetsEditPhotosParams {
  /**
   * A list of photo ids to include in the set. They will appear in the set in
   * the order sent. This list must contain the primary photo id. All photos
   * must belong to the owner of the set. This list of photos replaces the
   * existing list. Call flickr.photosets.addPhoto to append a photo to a set.
   *
   * Note.
   * - it could contain photos which are currently not in the
   * photoset.
   */
  photoIds: string[];
  /**
   * The id of the photoset to modify. The photoset must belong to the calling
   * user.
   */
  photosetId: string;
  /**
   * The id of the photo to use as the 'primary' photo for the set. This id must
   * also be passed along in photo_ids list argument.
   */
  primaryPhotoId: string;
}
export type PhotosetsEditPhotosResponse = FlickrOkResponse;

/**
 * Modify the photos in a photoset. Use this method to add, remove and
 * re-order photos.
 *
 * @requires `write` permission
 *
 * @see https://www.flickr.com/services/api/flickr.photosets.editPhotos.html
 */
export default async function photosetsEditPhotos(
  payload: PhotosetsEditPhotosParams,
  options?: GeneralOptions,
) {
  return ky
    .post<PhotosetsEditPhotosResponse>("rest", {
      context: { useOAuth: true, ...options },
      searchParams: {
        method: "flickr.photosets.editPhotos",
        photo_ids: payload.photoIds.join(","),
        photoset_id: payload.photosetId,
        primary_photo_id: payload.primaryPhotoId,
      },
    })
    .then((response) => response.json());
}
