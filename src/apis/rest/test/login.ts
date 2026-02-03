import type { OAuthOptions } from "#utils/request/request-rest-xml.js";
import { requestRestXML } from "#utils/request/request-rest-xml.js";

export interface LoginResponse {
  stat: "ok";
  user: {
    id: string;
    username: string;
  };
}

interface LoginOptions {
  oauth: OAuthOptions;
}

type LoginParams = Record<PropertyKey, boolean | number | string | undefined>;

interface LoginResponseRaw {
  stat: "ok";
  user: {
    id: string;
    username: string;
  };
}

/**
 * @see https://www.flickr.com/services/api/flickr.test.login.html
 */
export async function login(
  options: LoginOptions,
  params?: LoginParams,
): Promise<LoginResponse> {
  const requestParams = {
    method: "flickr.test.login",
    ...params,
  };

  const response = await requestRestXML<LoginResponseRaw>({
    oauth: options.oauth,
    params: requestParams,
  });

  return response;
}
