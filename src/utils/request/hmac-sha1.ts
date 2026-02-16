import { createHMAC, createSHA1 } from "hash-wasm";

/**
 * Digest to base64 with HMAC-SHA1 in wasm hash.
 * @see https://oauth.net/core/1.0a/#rfc.section.9.2
 * @returns base64 encoded string
 */
export async function hmacSha1Base64(
  message: string,
  key: string,
): Promise<string> {
  const hmac = await createHMAC(createSHA1(), key);
  const digest = hmac.init().update(message).digest("binary");
  return base64Encode(digest);
}

/**
 * Encode a byte array to base64 in Node or browser environments.
 */
function base64Encode(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(bytes).toString("base64");
  }

  if (typeof btoa === "function") {
    // Browser environment
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  throw new Error("Base64 encoding is not supported in this environment.");
}
