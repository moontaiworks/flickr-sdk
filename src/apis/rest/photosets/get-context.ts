import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface PhotosetsGetContextParams {
  /**
   * The id of the photo to fetch the context for.
   */
  photoId: string;
  /**
   * The id of the photoset for which to fetch the photo's context.
   */
  photosetId: string;
}

export interface PhotosetsGetContextResponse {
  /**
   * The total number of photos in the photoset.
   * @example "30"
   */
  count: string;
  /**
   * The next photo in the photoset. `id` is `"0"` when there is no next photo.
   */
  nextphoto: PhotoContext;
  /**
   * The previous photo in the photoset. `id` is `"0"` when there is no previous photo.
   */
  prevphoto: PhotoContext;
}

type PhotoContext = PhotoContextEmpty | PhotoContextFull;

interface PhotoContextEmpty {
  /**
   * When at the boundary of the photoset (no prev or next), this will be `"0"`.
   */
  id: "0";
}

interface PhotoContextFull {
  /**
   * The farm id.
   * @example "66"
   */
  farm: string;
  /**
   * The id of the photo.
   * @example "55157619616"
   */
  id: string;
  /**
   * The license id.
   * @example "0"
   */
  license: string;
  /**
   * The media type.
   * @example "photo"
   */
  media: string;
  /**
   * The owner's NSID.
   * @example "201140585@N02"
   */
  owner: string;
  /**
   * The secret for the photo.
   * @example "8fe72757ef"
   */
  secret: string;
  /**
   * The server id.
   * @example "65535"
   */
  server: string;
  /**
   * The thumbnail URL of the photo.
   * @example "https://live.staticflickr.com/65535/55157619616_8fe72757ef_s.jpg"
   */
  thumb: string;
  /**
   * The title of the photo.
   * @example "0001"
   */
  title: string;
  /**
   * The URL of the photo in the photoset.
   * @example "/photos/201140585@N02/55157619616/in/set-72177720332623026/"
   */
  url: string;
}

/**
 * Returns next and previous photos for a photo in a set.
 *
 * @see https://www.flickr.com/services/api/flickr.photosets.getContext.html
 */
export default async function photosetsGetContext(
  payload: PhotosetsGetContextParams,
  options?: GeneralOptions,
) {
  return ky
    .get<PhotosetsGetContextResponse>("rest", {
      context: { ...options },
      searchParams: {
        method: "flickr.photosets.getContext",
        photo_id: payload.photoId,
        photoset_id: payload.photosetId,
      },
    })
    .then((response) => response.json());
}
