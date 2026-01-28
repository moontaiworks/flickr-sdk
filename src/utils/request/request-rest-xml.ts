import { XMLParser } from "fast-xml-parser";

export interface RequestRestOptions {
  method?: "GET" | "POST";
  params: URLSearchParams;
}

export async function requestRestXML<T>(options: RequestRestOptions) {
  const endpoint = "https://api.flickr.com/services/rest";
  const { method = "GET", params } = options;

  const url = new URL(endpoint);
  url.search = params.toString();

  const request = new Request(url, { method });

  return fetch(request).then(async (response) => {
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

    return xmlDoc.rsp;
  });
}
