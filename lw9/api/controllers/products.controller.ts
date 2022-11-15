import { URLSearchParams } from "url";
import { JsonRequest } from "../request";
import { CONFIG } from "../../config/env";

export class ProductsController {

  async getAll(): Promise<any[]> {
    return (await new JsonRequest()
      .prefixUrl(new URL(CONFIG.API_PREFIX, CONFIG.BASE_URL))
      .url('products')
      .send()).body;
  }

  async create(params: any): Promise<any> {
    return (await new JsonRequest()
      .prefixUrl(new URL(CONFIG.API_PREFIX, CONFIG.BASE_URL))
      .url('addproduct')
      .body(params)
      .method("POST")
      .send()).body;
  }

  async edit(params: any): Promise<any> {
    return (await new JsonRequest()
      .prefixUrl(new URL(CONFIG.API_PREFIX, CONFIG.BASE_URL))
      .url('editproduct')
      .body(params)
      .method("POST")
      .send()).body;
  }

  async deleteById(id: string): Promise<any> {
    return (await new JsonRequest()
      .prefixUrl(new URL(CONFIG.API_PREFIX, CONFIG.BASE_URL))
      .url('deleteproduct')
      .searchParams(new URLSearchParams({ id }))
      .send()).body;
  }

}