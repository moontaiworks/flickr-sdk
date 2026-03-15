import createEndpoint from "./create.js";
import type { GeneralOptions } from "./options.js";

export * from "./auth/construct.js";
export type * from "./rest/test/echo.js";
export type * from "./rest/test/login.js";
export type * from "./rest/test/null.js";

export const flickr = createEndpoint();

export function createFlickr(optionsDefault: GeneralOptions) {
  return createEndpoint(optionsDefault);
}
