import { IApi, IOrder, IProductsResponse } from "../../../types";

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get("/product/");
  }

  createOrder(order: IOrder): Promise<{ total: number }> {
    return this.api.post("/order/", order);
  }
}
