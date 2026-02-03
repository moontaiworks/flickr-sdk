import { requestRestXML } from "#utils/request/request-rest-xml.js";

interface EchoOptions {
  apiKey: string;
}

/**
 * @see https://www.flickr.com/services/api/flickr.test.echo.html
 */
export function echo<
  const R extends Record<PropertyKey, boolean | number | string | undefined>,
>(options: EchoOptions, content?: R) {
  const params = {
    api_key: options.apiKey,
    method: "flickr.test.echo",
    ...content,
  };

  return requestRestXML<R & typeof params>({ params });
}
