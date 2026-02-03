import { XMLParser } from "fast-xml-parser";
import type { SearchParamsOption } from "ky";
import { default as ky } from "ky";

import { createOAuthAuthorizationHeader } from "./oauth";

const endpoint = "https://api.flickr.com/services/rest";

export interface OAuthOptions {
  callback?: string;
  consumerKey: string;
  consumerSecret?: string;
  nonce?: string;
  timestamp?: string;
  token?: string;
  tokenSecret?: string;
  verifier?: string;
}

export interface RequestRestOptions {
  method?: "GET" | "POST";
  oauth?: OAuthOptions;
  params: SearchParamsOption;
}

interface RequestConfig {
  headers?: Record<string, string>;
  method: "GET" | "POST";
  searchParams: URLSearchParams;
}

export async function buildRestRequestConfig(
  options: RequestRestOptions,
): Promise<RequestConfig> {
  const { method = "GET", oauth, params } = options;
  const searchParams = toSearchParams(params);
  let headers: Record<string, string> | undefined;

  if (oauth) {
    if (!oauth.consumerKey) {
      throw new Error("OAuth consumerKey is required.");
    }

    if (oauth.consumerSecret) {
      const authorization = await createOAuthAuthorizationHeader({
        method,
        oauth: {
          callback: oauth.callback,
          consumerKey: oauth.consumerKey,
          consumerSecret: oauth.consumerSecret,
          nonce: oauth.nonce,
          timestamp: oauth.timestamp,
          token: oauth.token,
          tokenSecret: oauth.tokenSecret,
          verifier: oauth.verifier,
        },
        params: searchParams,
        url: endpoint,
      });

      headers = {
        Authorization: authorization,
      };
    } else if (!searchParams.has("api_key")) {
      searchParams.set("api_key", oauth.consumerKey);
    }
  }

  return {
    headers,
    method,
    searchParams,
  };
}

function appendParam(
  params: URLSearchParams,
  key: string,
  value: unknown,
): void {
  if (value === undefined) return;

  if (value === null) {
    params.append(key, "");
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      appendParam(params, key, entry);
    }

    return;
  }

  const valueType = typeof value;
  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean" ||
    valueType === "bigint"
  ) {
    const primitive = value as bigint | boolean | number | string;
    params.append(key, `${primitive}`);
    return;
  }

  if (value instanceof Date) {
    params.append(key, value.toISOString());
    return;
  }

  const serialized = JSON.stringify(value) as string | undefined;
  params.append(key, serialized ?? "");
}

function toSearchParams(params: SearchParamsOption): URLSearchParams {
  if (params instanceof URLSearchParams) {
    return new URLSearchParams(params);
  }

  if (typeof params === "string") {
    return new URLSearchParams(params);
  }

  const searchParams = new URLSearchParams();

  if (Array.isArray(params)) {
    for (const [key, value] of params) {
      appendParam(searchParams, key, value);
    }

    return searchParams;
  }

  if (params && typeof params === "object") {
    for (const [key, value] of Object.entries(params)) {
      appendParam(searchParams, key, value);
    }
  }

  return searchParams;
}

const xmlParser = new XMLParser({
  allowBooleanAttributes: true,
  alwaysCreateTextNode: true,
  attributeNamePrefix: "",
  attributesGroupName: false,
  ignoreAttributes: false,
  ignoreDeclaration: true,
});

interface ErrorResponse {
  err: {
    code: string;
    msg: string;
  };
  stat: "fail";
}

export async function requestRestXML<T>(options: RequestRestOptions) {
  const { headers, method, searchParams } =
    await buildRestRequestConfig(options);

  const response = await ky(endpoint, {
    headers,
    method,
    searchParams,
  });

  const text = await response.text();
  const xmlDoc = xmlParser.parse(text) as {
    rsp: ErrorResponse | (T & { stat: "ok" });
  };
  if (!("rsp" in xmlDoc)) throw new Error("Invalid XML response!");

  if ("stat" in xmlDoc.rsp && xmlDoc.rsp.stat === "fail") {
    console.error("Got error response", xmlDoc.rsp);
    throw new Error(`${xmlDoc.rsp.err.code}: ${xmlDoc.rsp.err.msg}`);
  }

  return xmlDoc.rsp;
}
