import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type TestNullParams = never;
export type TestNullResponse = FlickrOkResponse;

/**
 * Null test
 *
 * This method requires authentication with 'read' permission.
 *
 * @see https://www.flickr.com/services/api/flickr.test.null.html
 */
export default async function testNull(options?: GeneralOptions) {
  return ky
    .post<TestNullResponse>("rest", {
      context: { useOAuth: true, ...options },
      searchParams: {
        method: "flickr.test.null",
      },
    })
    .then((response) => response.json());
}
