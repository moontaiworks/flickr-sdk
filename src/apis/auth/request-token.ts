import type { GeneralOptions } from "#apis/options.js";
import { ky } from "#utils/request/ky.js";

export interface RequestTokenParams {
  /**
   * The URL to which the user will be redirected after they authorize your
   * application.
   */
  oauth_callback?: string;
}
export interface RequestTokenResponse {
  oauth_callback_confirmed: "true" & (string & {});
  oauth_token: string;
  oauth_token_secret: string;
}

/**
 * Getting a Request Token.
 *
 * The first step to obtaining authorization for a user is to get a Request
 * Token using your Consumer Key. This is a temporary token that will be used to
 * authenticate the user to your application. This token, along with a token
 * secret, will later be exchanged for an [Access
 * Token](https://www.flickr.com/services/api/auth.oauth.html#access_token).
 *
 * @see https://www.flickr.com/services/api/auth.oauth.html
 * @throws a query string formatted error message when failed to request a url.
 */
export default async function requestToken(
  { oauth_callback = "" }: RequestTokenParams,
  options?: GeneralOptions,
) {
  const response = await ky("oauth/request_token", {
    context: { useOAuth: true, ...options },
    searchParams: {
      oauth_callback,
    },
  }).then((res) => res.text());

  if (!response.includes("oauth_token")) {
    return Promise.reject(new Error(response));
  }

  return Object.fromEntries(new URLSearchParams(response).entries());
}
