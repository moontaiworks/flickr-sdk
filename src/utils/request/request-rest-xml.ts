import { XMLParser } from "fast-xml-parser";
import type { SearchParamsOption } from "ky";
import { default as ky } from "ky";

export interface RequestRestOptions {
  method?: "GET" | "POST";
  params: SearchParamsOption;
}

const xmlParser = new XMLParser({
  allowBooleanAttributes: true,
  alwaysCreateTextNode: true,
  attributeNamePrefix: "",
  attributesGroupName: false,
  ignoreAttributes: false,
  ignoreDeclaration: true,
});

interface ErrorResponse {
  err: {
    code: string;
    msg: string;
  };
  stat: "fail";
}

interface SuccessResponse {
  stat: "ok";
}

export async function requestRestXML<T>(options: RequestRestOptions) {
  const endpoint = "https://api.flickr.com/services/rest";
  const { method = "GET", params: searchParams } = options;

  const response = await ky(endpoint, {
    method,
    searchParams,
  });

  const text = await response.text();
  const xmlDoc = xmlParser.parse(text) as {
    rsp: ErrorResponse | (SuccessResponse & T);
  };
  if (!("rsp" in xmlDoc)) throw new Error("Invalid XML response!");

  if ("stat" in xmlDoc.rsp && xmlDoc.rsp.stat === "fail") {
    console.error("Got error response", xmlDoc.rsp);
    throw new Error(`${xmlDoc.rsp.err.code}: ${xmlDoc.rsp.err.msg}`);
  }

  return xmlDoc.rsp;
}
