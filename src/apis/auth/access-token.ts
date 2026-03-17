import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface AccessTokenParams {
  oauth_verifier: string;
}
export interface AccessTokenResponse {
  /**
   * The user's real name in system.
   */
  fullname: string;
  /**
   * OAuth Token.
   */
  oauth_token: string;
  /**
   * OAuth Token Secret.
   */
  oauth_token_secret: string;
  /**
   * The user's NSID.
   * @example "140551311@N06"
   */
  user_nsid: string;
  /**
   * The user's username.
   * @example "月太げつたい"
   */
  username: string;
}

export default function createAccessToken(optionsDefault?: GeneralOptions) {
  /**
   * Exchanging the Request Token for an Access Token.
   *
   * After the user authorizes your application, you can exchange the approved
   * [Request
   * Token](https://www.flickr.com/services/api/auth.oauth.html#request_token) for
   * an Access Token. This Access Token should be stored by your application, and
   * used to make authorized requests to Flickr.
   *
   * @see https://www.flickr.com/services/api/auth.oauth.html
   * @throws a query string formatted error message when failed to request a url.
   */
  return async function (
    { oauth_verifier }: AccessTokenParams,
    options?: GeneralOptions,
  ) {
    const response = await ky("oauth/access_token", {
      context: {
        ...optionsDefault,
        useOAuth: true,
        ...options,
      },
      searchParams: {
        oauth_verifier: oauth_verifier,
      },
    }).then((res) => res.text());

    console.log(response);

    if (!response.includes("oauth_token")) {
      return Promise.reject(new Error(response));
    }

    return Object.fromEntries(new URLSearchParams(response).entries());
  };
}
