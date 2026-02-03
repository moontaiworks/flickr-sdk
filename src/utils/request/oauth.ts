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

export async function createOAuthAuthorizationHeader(
  input: OAuthInput,
): Promise<string> {
  void input;
  await Promise.resolve();
  return "";
}
