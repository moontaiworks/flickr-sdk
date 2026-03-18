import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface PhotosetsEditMetaParams {
  /**
   * A description of the photoset. May contain limited html.
   */
  description?: string;
  /**
   * The id of the photoset to modify.
   */
  photosetId: string;
  /**
   * The new title for the photoset.
   */
  title: string;
}
export interface PhotosetsEditMetaResponse {
  photoset: {
    /**
     * User defined description of the set.
     * @example "2022.12.10 @ 台大綜合體育館 1F"
     */
    description: string;
    /**
     * The id of the photoset.
     * @example "72177720304407041"
     */
    id: string;
    /**
     * User defined title of the set.
     * @example "2022.12.10 巴哈姆特 26 周年站聚"
     */
    title: string;
  };
}

export default function createPhotosetsEditMeta(
  optionsDefault?: GeneralOptions,
) {
  /**
   * Modify the meta-data for a photoset.
   *
   * @requires `write` permission
   *
   * @see https://www.flickr.com/services/api/flickr.photosets.editMeta.html
   */
  return async function (
    payload: PhotosetsEditMetaParams,
    options?: GeneralOptions,
  ) {
    return ky
      .post<PhotosetsEditMetaResponse>("rest", {
        context: { ...optionsDefault, useOAuth: true, ...options },
        searchParams: {
          description: payload.description,
          method: "flickr.photosets.editMeta",
          photoset_id: payload.photosetId,
          title: payload.title,
        },
      })
      .then((response) => response.json());
  };
}
