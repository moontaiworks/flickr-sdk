it("loads Flickr OAuth env vars for tests", () => {
  expect(process.env.FLICKR_CONSUMER_KEY).not.toBeUndefined();
  expect(process.env.FLICKR_CONSUMER_SECRET).not.toBeUndefined();
  expect(process.env.FLICKR_TOKEN).not.toBeUndefined();
  expect(process.env.FLICKR_TOKEN_SECRET).not.toBeUndefined();
});
