import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type NullOptions = Record<
  PropertyKey,
  boolean | number | string | undefined
>;
export type NullResponse<R extends NullOptions> = FlickrOkResponse<R>;

/**
 * Null test
 *
 * This method requires authentication with 'read' permission.
 *
 * @see https://www.flickr.com/services/api/flickr.test.null.html
 */
export default async function endpoint<R extends NullOptions>(
  this: void | { [key: PropertyKey]: unknown; options?: GeneralOptions },
  options?: GeneralOptions,
) {
  const mergedOptions = {
    useOAuth: true,
    ...this?.options,
    ...options,
  } satisfies GeneralOptions;
  const searchParams = {
    method: "flickr.test.null",
  } as const;

  return ky
    .post<NullResponse<R>>("rest", {
      context: {
        consumerKey: mergedOptions.consumerKey,
        consumerSecret: mergedOptions.consumerSecret,
        oauthUser: mergedOptions.oauthUser,
        useOAuth: mergedOptions.useOAuth,
      },
      searchParams,
    })
    .then((response) => response.json());
}
