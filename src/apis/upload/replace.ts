import ky from "ky";

import type { GeneralOptions } from "#apis/options.js";
import { sign } from "#utils/request/oauth.js";
import { parseFlickrXML } from "#utils/request/xml-parser.js";

export interface ReplaceParams {
  /**
   * Photos may be replaced in async mode, for applications that don't want to
   * wait around for an upload to complete, leaving a socket connection open the
   * whole time. Processing photos asynchronously is recommended. Please
   * [consult the
   * documentation](https://www.flickr.com/services/api/upload.async.html) for
   * details.
   *
   * @see https://www.flickr.com/services/api/replace.async.html
   */
  async?: boolean;
  /**
   * The file to upload.
   */
  photo: File;
  /**
   * The ID of the photo to replace.
   */
  photoId: string;
}

export interface ReplaceResponse {
  originalSecret?: string;
  photoId?: string;
  secret?: string;
  ticketId?: string;
}

export default function createReplace(optionsDefault?: GeneralOptions) {
  /**
   * Replacing Photos.
   *
   * Uploading apps can call the
   * [flickr.people.getUploadStatus](https://www.flickr.com/services/api/flickr.people.getUploadStatus.html)
   * method in the regular API to obtain file and bandwidth limits for the user.
   *
   * @see https://www.flickr.com/services/api/replace.api.html
   */
  async function replace(
    params: ReplaceParams & { async: true },
    options?: GeneralOptions,
  ): Promise<Required<Pick<ReplaceResponse, "ticketId">>>;
  async function replace(
    params: ReplaceParams & { async?: false },
    options?: GeneralOptions,
  ): Promise<Required<Omit<ReplaceResponse, "ticketId">>>;
  async function replace(
    { async, photo, photoId }: ReplaceParams,
    options?: GeneralOptions,
  ): Promise<ReplaceResponse> {
    const endpoint = new URL("https://up.flickr.com/services/replace/");
    const context = { ...optionsDefault, useOAuth: true, ...options };

    endpoint.searchParams.append("photo_id", photoId);
    if (async !== undefined)
      endpoint.searchParams.append("async", String(+async));

    await sign(endpoint, {
      credentials: {
        consumerKey: context.consumerKey!,
        consumerSecret: context.consumerSecret!,
        user: context.oauthUser,
      },
      method: "POST",
    });

    const body = new FormData();
    for (const [key, value] of endpoint.searchParams.entries())
      body.set(key, value);
    body.append("photo", photo);
    endpoint.search = ""; // Clear query params since they're now in the body

    const response = await ky
      .post<{
        photoid: { "#text": string; originalsecret: string; secret: string };
        ticketid: string;
      }>(endpoint, {
        body,
        parseJson: parseFlickrXML,
      })
      .then((res) => res.json());

    if (async) return { ticketId: response.ticketid };

    return {
      originalSecret: response.photoid.originalsecret,
      photoId: response.photoid["#text"],
      secret: response.photoid.secret,
    } satisfies ReplaceResponse;
  }

  return replace;
}
