import { XMLParser } from "fast-xml-parser";
import type { SearchParamsOption } from "ky";
import { default as ky } from "ky";

export interface RequestRestOptions {
  method?: "GET" | "POST";
  params: SearchParamsOption;
}

export async function requestRestXML<T>(options: RequestRestOptions) {
  const endpoint = "https://api.flickr.com/services/rest";
  const { method = "GET", params: searchParams } = options;

  const response = await ky(endpoint, {
    method,
    searchParams,
  });

  const text = await response.text();
  const parser = new XMLParser({
    allowBooleanAttributes: true,
    alwaysCreateTextNode: true,
    attributeNamePrefix: "",
    attributesGroupName: false,
    ignoreAttributes: false,
    ignoreDeclaration: true,
  });

  const xmlDoc = parser.parse(text) as { rsp: T };
  if (!("rsp" in xmlDoc)) throw new Error("Invalid XML response!");

  return xmlDoc.rsp;
}
