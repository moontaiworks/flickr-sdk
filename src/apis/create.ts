import createAccessTokenEndpoint from "./auth/access-token.js";
import createRequestTokenEndpoint from "./auth/request-token.js";
import type { GeneralOptions } from "./options.js";
import createFlickrTestEcho from "./rest/test/echo.js";
import createFlickrTestLogin from "./rest/test/login.js";
import createFlickrTestNull from "./rest/test/null.js";

export default function createEndpoint(optionsDefault?: GeneralOptions) {
  return {
    oauth: {
      accessToken: createAccessTokenEndpoint(optionsDefault),
      requestToken: createRequestTokenEndpoint(optionsDefault),
    },
    test: {
      echo: createFlickrTestEcho(optionsDefault),
      login: createFlickrTestLogin(optionsDefault),
      null: createFlickrTestNull(optionsDefault),
    },
  };
}
