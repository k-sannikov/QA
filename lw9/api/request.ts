import type { Response, Method } from "got";
import got from "got";
import type { URLSearchParams } from "url";

export class JsonRequest {

  private options: any = {
    method: "GET"
  }

  prefixUrl(prefixUrl: URL) {
    this.options.prefixUrl = prefixUrl;
    return this;
  }

  url(url: string) {
    this.options.url = url;
    return this;
  }

  method(method: Method) {
    this.options.method = method;
    return this;
  }

  searchParams(searchParams: URLSearchParams) {
    this.options.searchParams = searchParams;
    return this;
  }

  body(body: any) {
    this.options.json = body;
    return this;
  }

  public async send(): Promise<Response<any>> {
    let response = await got(this.options);

    try {
      response.body = JSON.parse(response.body);
    } catch { }
    
    return response;
  }

}
