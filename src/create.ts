import type { GeneralOptions } from "#apis/options.js";

import * as flickr from "./apis/index.js";

interface DeepEndpointObject {
  [key: string]: DeepEndpointObject | Endpoint;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Endpoint = (payload: any, options?: GeneralOptions) => Promise<any>;

export function createFlickr(optionsDefault: GeneralOptions): typeof flickr {
  return wrapObject(flickr as never, optionsDefault);
}

function wrap(fn: Endpoint, optionsDefault?: GeneralOptions): Endpoint {
  return (payload, options) => fn(payload, { ...optionsDefault, ...options });
}

function wrapObject<T extends DeepEndpointObject>(
  obj: T,
  optionsDefault?: GeneralOptions,
): T {
  return new Proxy(obj, {
    get(target, prop) {
      const value = Reflect.get(target, prop);
      if (typeof value === "function") return wrap(value, optionsDefault);
      if (typeof value === "object") return wrapObject(value, optionsDefault);
      return value;
    },
  });
}
