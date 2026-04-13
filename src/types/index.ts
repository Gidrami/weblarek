export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "online" | "cash" | null;

export type PartialBuyer = Partial<Record<keyof IBuyer, string>>;
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface ICartRemoveEventData {
  product: IProduct;
  updateCart: boolean;
}

export interface ICartCardState {
  product: IProduct;
  index: number;
}

export interface ICartState {
  elements: HTMLElement[];
  price: number;
}

export interface ICatalogViewModel {
  elements: HTMLElement[];
}

export interface ICartViewModel {
  counter: number;
}

export interface ICatalogCardPreviewView {
  product: IProduct;
  inCart: boolean;
}

export interface IModalViewModel {
  element: HTMLElement;
}

export interface IOrderCreatedViewModel {
  total: number;
}

export interface IOrderFirstStepFormViewModel {

}

export interface IOrderSecondStepFormViewModel {

}

export interface IOrderFirstStepFilledEvent extends Pick<IBuyer, 'payment' | 'address'> {
}

export interface IOrderSecondStepFilledEvent extends Pick<IBuyer, 'email' | 'phone'> {
}

export interface ICatalogCardPreviewViewModel {
  product: IProduct,
  inCart: boolean
}

export interface ICatalogCardView {
  product: IProduct
}