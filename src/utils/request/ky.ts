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

  if (request.body instanceof FormData)
    return handleFormData(request, request.body, credentials);

  return handleSearchParams(request, credentials);
}

async function handleFormData(
  request: Request,
  body: FormData,
  credentials: OAuthCredentials,
): Promise<Request> {
  const url = new URL(request.url);
  // if body present, force encode all params as URLSearchParams for signing
  for (const [key, value] of body.entries()) {
    if (typeof value !== "string") continue; // Skip non-string values for OAuth signing
    url.searchParams.set(key, value);
  }

  await sign(url, {
    credentials,
    method: request.method,
  });

  // Reconstruct body from signed params
  for (const [key, value] of url.searchParams.entries()) body.set(key, value);
  url.search = ""; // Clear query params since they're now in the body

  return new Request(url, { body });
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
