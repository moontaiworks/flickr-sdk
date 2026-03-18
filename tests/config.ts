import { createFlickr } from "#index.js";

export const systemCredentials = {
  consumerKey: process.env.FLICKR_CONSUMER_KEY!,
  consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
};

export const userCredentials = {
  oauthUser: {
    token: process.env.FLICKR_TOKEN!,
    tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
  },
};

export const flickr = createFlickr(systemCredentials);
export const flickrWithAuth = createFlickr({
  ...systemCredentials,
  ...userCredentials,
});
