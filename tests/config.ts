export const systemCredentials = {
  consumerKey: process.env.FLICKR_CONSUMER_KEY!,
  consumerSecret: process.env.FLICKR_CONSUMER_SECRET!,
};

export const userCredentials = {
  ...systemCredentials,
  oauthUser: {
    token: process.env.FLICKR_TOKEN!,
    tokenSecret: process.env.FLICKR_TOKEN_SECRET!,
  },
};
