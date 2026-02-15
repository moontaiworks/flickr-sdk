import type { BeforeRequestHook } from "ky";
import { default as kyInit } from "ky";

import { parseFlickrXML } from "./xml-parser.js";

interface Context {
  apiKey?: string;
}

const attachAuth: BeforeRequestHook = (request, options) => {
  console.debug("Preparing to attach authentication credentials...");
  const { apiKey } = options.context as Context;

  if (!apiKey) {
    console.debug("No API key provided; proceeding without authentication.");
    return;
  }

  return attachApiKey(request, apiKey);
};

function attachApiKey(request: Request, apiKey: string): Request {
  console.debug("Attaching API key to request...");
  const url = new URL(request.url);
  url.searchParams.set("api_key", apiKey);
  return new Request(url, request);
}

export const ky = kyInit.extend({
  hooks: { beforeRequest: [attachAuth] },
  parseJson: parseFlickrXML,
  prefixUrl: "https://api.flickr.com/services",
});
