import { flickr } from "@moontaiworks/flickr-sdk";
import { constructAuthUrl } from "../src/apis/auth/construct.js";
import Readline from "readline/promises";

const requestTokenResponse = await flickr.oauth.requestToken(
  { oauth_callback: "http://localhost/callback" },
  {
    consumerKey: process.env.FLICKR_CONSUMER_KEY!,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
  },
);

console.log("Request Token Response:", requestTokenResponse);

const url = constructAuthUrl(requestTokenResponse.oauth_token, "delete");
console.log("Authorization URL:", url);

const verifier = await Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}).question("Please input the returned oauth verifier after authorizing: ");

const accessTokenResponse = await flickr.oauth.accessToken(
  {
    oauth_verifier: verifier,
  },
  {
    consumerKey: process.env.FLICKR_CONSUMER_KEY!,
    consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
    oauthUser: {
      token: requestTokenResponse.oauth_token,
      tokenSecret: requestTokenResponse.oauth_token_secret,
    },
  },
);
console.log("Access Token Response:", accessTokenResponse);
