import type {
  AnySearchParams,
  OAuthOptions,
} from "#utils/request/request-rest-xml.js";
import { requestRestXML } from "#utils/request/request-rest-xml.js";

interface LoginOptions {
  oauth: OAuthOptions;
}

interface LoginResponse {
  user: {
    /** NSID */
    id: string;
    /** Alias on url path which replaces NSID in URLs */
    path_alias: string;
    /** Display name */
    username: string;
  };
}

/**
 * @see https://www.flickr.com/services/api/flickr.test.login.html
 */
export async function login(options: LoginOptions, params?: AnySearchParams) {
  const requestParams = {
    method: "flickr.test.login",
    ...params,
  };

  const response = await requestRestXML<LoginResponse>({
    oauth: options.oauth,
    params: requestParams,
  });

  return response;
}
