import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type TestEchoParams = object;
export type TestEchoResponse<R extends TestEchoParams> = FlickrOkResponse<R>;

export default function createEndpoint(optionsDefault?: GeneralOptions) {
  /**
   * A testing method which echo's all parameters back in the response.
   *
   * @see https://www.flickr.com/services/api/flickr.test.echo.html
   */
  return async function <DynamicParams extends TestEchoParams>(
    payload: DynamicParams,
    options?: GeneralOptions,
  ) {
    return ky
      .get<TestEchoResponse<DynamicParams>>("rest", {
        context: { ...optionsDefault, ...options },
        searchParams: {
          method: "flickr.test.echo",
          ...payload,
        },
      })
      .then((response) => response.json());
  };
}
