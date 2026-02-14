import { XMLParser } from "fast-xml-parser";

const xmlParser = new XMLParser({
  allowBooleanAttributes: true,
  alwaysCreateTextNode: false,
  attributeNamePrefix: "",
  attributesGroupName: false,
  ignoreAttributes: false,
  ignoreDeclaration: true,
});

interface FlickrErrorResponse {
  err: {
    code: string;
    msg: string;
  };
  stat: "fail";
}

type FlickrOkResponse<T = unknown> = T & { stat: "ok" };

interface FlickrResponse<T = unknown> {
  rsp: FlickrErrorResponse | FlickrOkResponse<T>;
}

export function parseFlickrXML(text: string) {
  const xmlDoc = xmlParser.parse(text) as FlickrResponse;

  if (!("rsp" in xmlDoc))
    throw new Error("Invalid XML response!", { cause: xmlDoc });

  if ("stat" in xmlDoc.rsp && xmlDoc.rsp.stat === "fail")
    throw new Error(`${xmlDoc.rsp.err.code}: ${xmlDoc.rsp.err.msg}`, {
      cause: xmlDoc.rsp,
    });

  return xmlDoc.rsp;
}
