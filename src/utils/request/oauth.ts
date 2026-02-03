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

const signatureMethod = "HMAC-SHA1";
const oauthVersion = "1.0";

export async function createOAuthAuthorizationHeader(
  input: OAuthInput,
): Promise<string> {
  const nonce = input.oauth.nonce ?? Date.now().toString();
  const timestamp =
    input.oauth.timestamp ?? Math.floor(Date.now() / 1000).toString();

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

  const headerParams: [string, string][] = [
    ...oauthParams,
    ["oauth_signature", signature],
  ];

  const headerValue = headerParams
    .map(([key, value]) => `${rfc3986Encode(key)}="${rfc3986Encode(value)}"`)
    .join(", ");

  return `OAuth ${headerValue}`;
}

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

async function hmacSha1Base64(message: string, key: string): Promise<string> {
  const { createHMAC, createSHA1 } = await import("hash-wasm");
  const hmac = await createHMAC(createSHA1(), key);
  const digest = hmac.init().update(message).digest("binary");
  return base64Encode(digest);
}

function normalizeBaseUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
}

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

function rfc3986Encode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => {
    return `%${char.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

function signingKey(consumerSecret: string, tokenSecret?: string): string {
  return `${rfc3986Encode(consumerSecret)}&${rfc3986Encode(tokenSecret ?? "")}`;
}
