import { hmacSha1Base64 } from "./hmac-sha1.js";
import { encodeRFC3986, serializeRFC3986 } from "./rfc-3986.js";
import { pureURL } from "./url-base.js";

/**
 * Generates a random string. OAuth 1.0 defines a nonce as a value unique
 * within a given timestamp in seconds.
 * @see https://oauth.net/core/1.0a/#nonce
 */
const nonce = () => Date.now().toString();

/**
 * Returns the Unix timestamp.
 * @see https://oauth.net/core/1.0a/#nonce
 */
const timestamp = () => Math.floor(Date.now() / 1000).toString();

/**
 * The signature method is always HMAC-SHA1.
 * @see https://oauth.net/core/1.0a/#rfc.section.9.2
 */
const signatureMethod = "HMAC-SHA1";

/**
 * The version is always 1.0.
 */
const version = "1.0";

export interface OAuthCredentials {
  consumerKey: string;
  consumerSecret: string;
  user?: {
    token: string;
    tokenSecret: string;
  };
}

interface SignParams {
  credentials: OAuthCredentials;
  method: string;
}

export async function sign(target: URL, { credentials, method }: SignParams) {
  const {
    consumerKey,
    consumerSecret,
    user: { token, tokenSecret } = { tokenSecret: "" },
  } = credentials;

  target.searchParams.set("oauth_consumer_key", consumerKey);
  target.searchParams.set("oauth_nonce", nonce());
  target.searchParams.set("oauth_signature_method", signatureMethod);
  target.searchParams.set("oauth_timestamp", timestamp());
  target.searchParams.set("oauth_version", version);
  if (token) target.searchParams.set("oauth_token", token);

  const signingKey = serializeRFC3986([consumerSecret, tokenSecret]);
  const signingMessage = serializeRFC3986([
    method,
    pureURL(target),
    serializeParams(target.searchParams),
  ]);
  const signature = await hmacSha1Base64(signingMessage, signingKey);
  target.searchParams.set("oauth_signature", signature);
}

function serializeParams(params: URLSearchParams): string {
  params.sort();

  const serializedParams: string[] = [];
  for (const [key, value] of params.entries())
    serializedParams.push(`${encodeRFC3986(key)}=${encodeRFC3986(value)}`);

  return serializedParams.join("&");
}
