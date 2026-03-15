import type { BeforeRequestHook, NormalizedOptions } from "ky";
import { default as kyInit } from "ky";

import type { OAuthCredentials } from "./oauth.js";
import { sign } from "./oauth.js";
import { parseFlickrXML } from "./xml-parser.js";

export interface OAuthContext {
  /**
   * Application API key from Flickr.
   * @see https://www.flickr.com/services/apps/by/me
   */
  consumerKey?: string;
  /**
   * Application API secret from Flickr, required for OAuth signing.
   * @see https://www.flickr.com/services/apps/by/me
   */
  consumerSecret?: string;
  /**
   * User credentials for OAuth signing, required if making requests on behalf
   * of a user. Optional if only making requests that require application-level
   * authentication.
   * @see https://www.flickr.com/services/api/auth.oauth.html
   */
  oauthUser?: UserCredentials;
  /**
   * Whether to use OAuth for signing requests. If false or omitted, the API key
   * will be attached as a query parameter.
   */
  useOAuth?: boolean;
}

interface UserCredentials {
  token: string;
  tokenSecret: string;
}

const attachAuth: BeforeRequestHook = async (request, options) => {
  console.debug("Preparing to attach authentication credentials...");
  const { consumerKey, useOAuth } = options.context as OAuthContext;

  if (!consumerKey) {
    console.debug("No API key provided; proceeding without authentication.");
    return;
  }

  if (useOAuth) return attachOAuth(request, options);

  return attachApiKey(request, consumerKey);
};

function attachApiKey(request: Request, apiKey: string): Request {
  console.debug("Attaching API key to request...");
  const url = new URL(request.url);
  url.searchParams.set("api_key", apiKey);
  return new Request(url, request);
}

async function attachOAuth(
  request: Request,
  options: NormalizedOptions,
): Promise<Request> {
  console.debug("Attaching OAuth credentials to request...");
  const { consumerKey, consumerSecret, oauthUser } =
    options.context as OAuthContext;
  if (!consumerSecret)
    throw new Error("OAuth consumer secret is required for signing requests.");

  const credentials: OAuthCredentials = {
    consumerKey: consumerKey!,
    consumerSecret,
    user: oauthUser,
  };

  if (request.method.toUpperCase() === "POST")
    return handlePostSearchParams(request, credentials);

  return handleSearchParams(request, credentials);
}

async function handlePostSearchParams(
  request: Request,
  credentials: OAuthCredentials,
) {
  const url = new URL(request.url);

  await sign(url, {
    credentials,
    method: request.method,
  });

  const searchParams = new URLSearchParams(url.search);
  url.search = ""; // Clear query params since they'll be included in the body

  return new Request(url, { body: searchParams, method: request.method });
}

async function handleSearchParams(
  request: Request,
  credentials: OAuthCredentials,
) {
  const url = new URL(request.url);

  await sign(url, {
    credentials,
    method: request.method,
  });

  return new Request(url);
}

export const ky = kyInit.extend({
  hooks: { beforeRequest: [attachAuth] },
  parseJson: parseFlickrXML,
  prefixUrl: "https://api.flickr.com/services",
});
