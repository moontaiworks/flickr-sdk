import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type DeleteOptions = Record<
  PropertyKey,
  boolean | number | string | undefined
>;
export type DeleteResponse<R extends DeleteOptions> = FlickrOkResponse<R>;

/**
 * A testing method which checks if the caller is logged in then returns their username.
 *
 * This method requires authentication with 'read' permission.
 *
 * @see https://www.flickr.com/services/api/flickr.test.login.html
 */
export default async function endpoint<R extends DeleteOptions>(
  this: void | { [key: PropertyKey]: unknown; options?: GeneralOptions },
  options?: GeneralOptions,
) {
  const mergedOptions = {
    useOAuth: true,
    ...this?.options,
    ...options,
  } satisfies GeneralOptions;
  const searchParams = {
    method: "flickr.test.login",
  } as const;

  return ky
    .post<DeleteResponse<R>>("rest", {
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
