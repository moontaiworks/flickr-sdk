import { createHMAC, createSHA1 } from "hash-wasm";

/**
 * Input required to build an OAuth 1.0a Authorization header.
 */
export interface OAuthInput {
  method: "GET" | "POST";
  oauth: {
    callback?: string;
    consumerKey: string;
    consumerSecret: string;
    nonce?: string;
    timestamp?: string;
    token?: string;
    tokenSecret?: string;
    verifier?: string;
  };
  params: URLSearchParams;
  url: string;
}

/**
 * The signature method is always HMAC-SHA1.
 * @see https://oauth.net/core/1.0a/#rfc.section.9.2
 */
const signatureMethod = "HMAC-SHA1";
/**
 * The version is always 1.0.
 */
const oauthVersion = "1.0";

/**
 * Create an OAuth 1.0a Authorization header value for the given request.
 *
 * @example
 * ```ts
 * const header = await createOAuthAuthorizationHeader({
 *   method: "GET",
 *   url: "https://api.flickr.com/services/rest",
 *   params: new URLSearchParams({
 *     method: "flickr.test.echo",
 *     format: "json",
 *   }),
 *   oauth: {
 *     consumerKey: "your-consumer-key",
 *     consumerSecret: "your-consumer-secret",
 *     token: "user-token",
 *     tokenSecret: "user-token-secret",
 *   },
 * });
 * ```
 */
export async function createOAuthAuthorizationHeader(
  input: OAuthInput,
): Promise<string> {
  const headerParams = await createOAuthParams(input);
  const headerValue = headerParams
    .map(([key, value]) => `${rfc3986Encode(key)}="${rfc3986Encode(value)}"`)
    .join(", ");

  return `OAuth ${headerValue}`;
}

/**
 * Create OAuth params suitable for query strings.
 *
 * @example
 * ```ts
 * const params = await createOAuthParams({
 *   method: "GET",
 *   url: "https://api.flickr.com/services/rest",
 *   params: new URLSearchParams({ method: "flickr.test.echo" }),
 *   oauth: {
 *     consumerKey: "your-consumer-key",
 *     consumerSecret: "your-consumer-secret",
 *     token: "user-token",
 *     tokenSecret: "user-token-secret",
 *   },
 * });
 * ```
 */
export async function createOAuthParams(
  input: OAuthInput,
): Promise<[string, string][]> {
  const nonce = input.oauth.nonce ?? Date.now().toString();
  const timestamp =
    input.oauth.timestamp ?? Math.floor(Date.now() / 1000).toString();

  // Base OAuth params used for signature and requests.
  const oauthParams: [string, string][] = [
    ["oauth_consumer_key", input.oauth.consumerKey],
    ["oauth_nonce", nonce],
    ["oauth_signature_method", signatureMethod],
    ["oauth_timestamp", timestamp],
    ["oauth_version", oauthVersion],
  ];

  if (input.oauth.token) {
    oauthParams.push(["oauth_token", input.oauth.token]);
  }

  if (input.oauth.callback) {
    oauthParams.push(["oauth_callback", input.oauth.callback]);
  }

  if (input.oauth.verifier) {
    oauthParams.push(["oauth_verifier", input.oauth.verifier]);
  }

  // Signature includes both request query params and OAuth params.
  const baseUrl = normalizeBaseUrl(input.url);
  const urlParams = Array.from(input.params.entries());
  const signatureBase = buildBaseString(input.method, baseUrl, [
    ...urlParams,
    ...oauthParams,
  ]);

  const signature = await hmacSha1Base64(
    signatureBase,
    signingKey(input.oauth.consumerSecret, input.oauth.tokenSecret),
  );

  return [...oauthParams, ["oauth_signature", signature]];
}

/**
 * Encode a byte array to base64 in Node or browser environments.
 */
function base64Encode(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  if (typeof btoa === "function") {
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  throw new Error("Base64 encoding is not supported in this environment.");
}

/**
 * Create the OAuth 1.0a signature base string.
 */
function buildBaseString(
  method: string,
  url: string,
  params: [string, string][],
): string {
  const normalizedParams = normalizeParams(params);
  return [
    method.toUpperCase(),
    rfc3986Encode(url),
    rfc3986Encode(normalizedParams),
  ].join("&");
}

/**
 * Compute HMAC-SHA1 digest and return a base64 string.
 */
async function hmacSha1Base64(message: string, key: string): Promise<string> {
  const hmac = await createHMAC(createSHA1(), key);
  const digest = hmac.init().update(message).digest("binary");
  return base64Encode(digest);
}

/**
 * Remove query/fragment to match OAuth base URL requirements.
 */
function normalizeBaseUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
}

/**
 * Sort and percent-encode params for the OAuth signature base string.
 */
function normalizeParams(params: [string, string][]): string {
  const encoded = params.map(([key, value]) => ({
    key: rfc3986Encode(key),
    value: rfc3986Encode(value),
  }));

  encoded.sort((left, right) => {
    if (left.key === right.key) {
      return left.value.localeCompare(right.value);
    }

    return left.key.localeCompare(right.key);
  });

  return encoded.map(({ key, value }) => `${key}=${value}`).join("&");
}

/**
 * RFC 3986 compliant percent-encoding.
 */
function rfc3986Encode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => {
    return `%${char.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

/**
 * OAuth signing key: consumer secret + token secret.
 */
function signingKey(consumerSecret: string, tokenSecret?: string): string {
  return `${rfc3986Encode(consumerSecret)}&${rfc3986Encode(tokenSecret ?? "")}`;
}
