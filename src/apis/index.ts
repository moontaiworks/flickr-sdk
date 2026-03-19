import createEndpoint from "./create.js";
import type { GeneralOptions } from "./options.js";

export * from "./auth/access-token.js";
export * from "./auth/construct.js";
export * from "./auth/request-token.js";
export * from "./rest/photos/delete.js";
export * from "./rest/photos/upload/check-tickets.js";
export * from "./rest/photosets/add-photo.js";
export * from "./rest/photosets/create.js";
export * from "./rest/photosets/delete.js";
export * from "./rest/photosets/edit-meta.js";
export * from "./rest/photosets/edit-photos.js";
export * from "./rest/test/echo.js";
export * from "./rest/test/login.js";
export * from "./rest/test/null.js";
export * from "./upload/replace.js";
export * from "./upload/upload.js";

export const flickr = createEndpoint();

export function createFlickr(optionsDefault: GeneralOptions) {
  return createEndpoint(optionsDefault);
}
