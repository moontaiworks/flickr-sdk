import { default as kyInit } from "ky";

import { parseFlickrXML } from "./xml-parser.js";

export const ky = kyInit.extend({
  parseJson: parseFlickrXML,
});
