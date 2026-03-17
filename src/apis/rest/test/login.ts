import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type TestLoginParams = never;
export type TestLoginResponse = FlickrOkResponse;

export default function createTestLogin(optionsDefault?: GeneralOptions) {
  /**
   * A testing method which checks if the caller is logged in then returns their username.
   *
   * This method requires authentication with 'read' permission.
   *
   * @see https://www.flickr.com/services/api/flickr.test.login.html
   */
  return async function (options?: GeneralOptions) {
    return ky
      .post<TestLoginResponse>("rest", {
        context: { ...optionsDefault, useOAuth: true, ...options },
        searchParams: {
          method: "flickr.test.login",
        },
      })
      .then((response) => response.json());
  };
}
