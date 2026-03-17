import ky from "ky";

import type { GeneralOptions } from "#apis/options.js";
import { sign } from "#utils/request/oauth.js";
import { parseFlickrXML } from "#utils/request/xml-parser.js";

export enum UploadContentType {
  Other = 3,
  Photo = 1,
  Screenshot = 2,
}

export enum UploadSafetyLevel {
  Moderate = 2,
  Restricted = 3,
  Safe = 1,
}

export interface UploadParams {
  /**
   * @see https://www.flickr.com/services/api/upload.async.html
   */
  async?: boolean;
  /**
   * Set to 1 for Photo, 2 for Screenshot, or 3 for Other. If omitted, will be
   * set to user's default
   */
  contentType?: UploadContentType;
  /**
   * A description of the photo. May contain some limited HTML.
   */
  description?: string;
  /**
   * Set to false to keep the photo in global search results, true to hide from
   * public searches. If omitted, will be set based to user's default.
   */
  hidden?: boolean;
  /**
   * Specifies who can view the photo. If omitted permissions will be set to
   * user's default
   */
  isFamily?: boolean;
  /**
   * Specifies who can view the photo. If omitted permissions will be set to
   * user's default
   */
  isFriend?: boolean;
  /**
   * Specifies who can view the photo. If omitted permissions will be set to
   * user's default
   */
  isPublic?: boolean;
  /**
   * The photo to upload.
   */
  photo: File;
  /**
   * Set to 1 for Safe, 2 for Moderate, or 3 for Restricted. If omitted or an
   * invalid value is passed, will be set to user's default
   */
  safetyLevel?: UploadSafetyLevel;
  /**
   * A list of tags to apply to the photo.
   */
  tags?: string[];
  /**
   * The title of the photo.
   */
  title?: string;
}

export interface UploadResponse {
  /**
   * Present if async is false
   */
  photoid?: string;
  /**
   * Present if async is true
   */
  ticketid?: string;
}

export default function createUpload(optionsDefault?: GeneralOptions) {
  /**
   * Uploading Photos.
   *
   * Uploading apps can call the
   * [flickr.people.getUploadStatus](https://www.flickr.com/services/api/flickr.people.getUploadStatus.html)
   * method in the regular API to obtain file and bandwidth limits for the user.
   *
   * @see https://www.flickr.com/services/api/upload.api.html
   */
  async function upload(
    params: UploadParams & { async: true },
    options?: GeneralOptions,
  ): Promise<Required<Pick<UploadResponse, "ticketid">>>;
  async function upload(
    params: UploadParams & { async?: false },
    options?: GeneralOptions,
  ): Promise<Required<Pick<UploadResponse, "photoid">>>;
  async function upload(
    {
      async,
      contentType,
      description,
      hidden,
      isFamily,
      isFriend,
      isPublic,
      photo,
      safetyLevel,
      tags = [],
      title,
    }: UploadParams,
    options?: GeneralOptions,
  ): Promise<UploadResponse> {
    const endpoint = new URL("https://up.flickr.com/services/upload");
    const context = { ...optionsDefault, useOAuth: true, ...options };

    if (async !== undefined)
      endpoint.searchParams.append("async", String(+async));
    if (contentType !== undefined)
      endpoint.searchParams.append("content_type", String(contentType));
    if (description !== undefined)
      endpoint.searchParams.append("description", description);
    // 1 for global, 2 for hidden
    if (hidden !== undefined)
      endpoint.searchParams.append("hidden", String(+hidden + 1));
    if (isFamily !== undefined)
      endpoint.searchParams.append("is_family", String(+isFamily));
    if (isFriend !== undefined)
      endpoint.searchParams.append("is_friend", String(+isFriend));
    if (isPublic !== undefined)
      endpoint.searchParams.append("is_public", String(+isPublic));
    if (safetyLevel !== undefined)
      endpoint.searchParams.append("safety_level", String(safetyLevel));
    // The document says tags should be space-separated, but seems
    // comma-separated is works better. The comma-separated tags could include
    // spaces.
    if (tags.length) endpoint.searchParams.append("tags", tags.join(","));
    if (title !== undefined) endpoint.searchParams.append("title", title);

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
      .post<UploadResponse>(endpoint, {
        body,
        parseJson: parseFlickrXML,
      })
      .then((res) => res.json());

    return response;
  }
  return upload;
}
