import type { GeneralOptions } from "#apis/options.js";

import { default as rest } from "./rest/index.js";

export default { rest };

export const createFlickr = (options: GeneralOptions) =>
  wrap({ rest }, options);

interface DeepObject {
  [key: PropertyKey]: DeepObject | Handler;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (...args: any[]) => Promise<unknown>;

function wrap<O extends DeepObject>(target: O, options: GeneralOptions): O {
  return new Proxy(target, {
    get(target, prop) {
      const it = Reflect.get<O, keyof O>(target, prop as keyof O);
      if (typeof it === "function") return it.bind({ options });
      if (typeof it === "object") return wrap(it, options);
      return it;
    },
  });
}
