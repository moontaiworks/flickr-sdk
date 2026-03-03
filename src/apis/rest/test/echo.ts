import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";
import type { FlickrOkResponse } from "#utils/request/xml-parser.js";

export type EchoOptions = Record<
  PropertyKey,
  boolean | number | string | undefined
>;
export type EchoResponse<R extends EchoOptions> = FlickrOkResponse<R>;

/**
 * A testing method which echo's all parameters back in the response.
 *
 * @see https://www.flickr.com/services/api/flickr.test.echo.html
 */
export default async function endpoint<R extends EchoOptions>(
  this: void | { [key: PropertyKey]: unknown; options?: GeneralOptions },
  payload: R,
  options?: GeneralOptions,
): Promise<EchoResponse<R>> {
  const { credentials } = { ...this?.options, ...options };
  const searchParams = {
    method: "flickr.test.echo",
    ...payload,
  } as const;

  return ky
    .get<EchoResponse<R>>("rest", { context: { ...credentials }, searchParams })
    .then((response) => response.json());
}
