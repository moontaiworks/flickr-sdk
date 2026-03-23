export function constructAuthUrl(
  oauthToken: string,
  permission: "delete" | "read" | "write",
) {
  const url = new URL("https://www.flickr.com/services/oauth/authorize");

  url.searchParams.set("oauth_token", oauthToken);
  url.searchParams.set("perms", permission);

  return url.toString();
}
