import type { BeforeRequestHook, NormalizedOptions } from "ky";
import { default as kyInit } from "ky";

import { parseFlickrXML } from "./xml-parser.js";

interface Context {
  apiKey?: string;
  oauth?: {
    consumerSecret: string;
  };
}

const attachAuth: BeforeRequestHook = async (request, options) => {
  console.debug("Preparing to attach authentication credentials...");
  const { apiKey, oauth } = options.context as Context;

  if (!apiKey) {
    console.debug("No API key provided; proceeding without authentication.");
    return;
  }

  if (oauth) return attachOAuth(request, options);

  return attachApiKey(request, apiKey);
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
  const { oauth } = options.context as Context;
  if (!oauth?.consumerSecret)
    throw new Error("OAuth consumer secret is required for signing requests.");

  if (request.body instanceof FormData)
    return handleFormData(request, request.body);

  return handleSearchParams(request);
}

async function handleFormData(
  request: Request,
  body: FormData,
): Promise<Request> {
  const url = new URL(request.url);
  // if body present, force encode all params as URLSearchParams for signing
  for (const [key, value] of body.entries()) {
    if (typeof value !== "string") continue; // Skip non-string values for OAuth signing
    url.searchParams.set(key, value);
  }

  // TODO: sign the request with OAuth params
  await Promise.resolve(); // Placeholder for async signing logic

  // Reconstruct body from signed params
  for (const [key, value] of url.searchParams.entries()) body.set(key, value);

  return new Request(url, { body });
}

async function handleSearchParams(request: Request) {
  const url = new URL(request.url);

  // TODO: sign the request with OAuth params
  await Promise.resolve(); // Placeholder for async signing logic

  return new Request(url);
}

export const ky = kyInit.extend({
  hooks: { beforeRequest: [attachAuth] },
  parseJson: parseFlickrXML,
  prefixUrl: "https://api.flickr.com/services",
});
