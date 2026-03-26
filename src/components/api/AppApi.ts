import { IApi, IOrder, IProductsResponse, IOrderResponse } from "../../types";

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get("/product/");
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post("/order/", order);
  }
}
