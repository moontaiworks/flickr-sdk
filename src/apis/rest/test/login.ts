import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type TestLoginParams = never;
export type TestLoginResponse = FlickrOkResponse;

/**
 * A testing method which checks if the caller is logged in then returns their username.
 *
 * This method requires authentication with 'read' permission.
 *
 * @see https://www.flickr.com/services/api/flickr.test.login.html
 */
export default async function testLogin(
  _?: TestLoginParams,
  options?: GeneralOptions,
) {
  return ky
    .post<TestLoginResponse>("rest", {
      context: { useOAuth: true, ...options },
      searchParams: {
        method: "flickr.test.login",
      },
    })
    .then((response) => response.json());
}
