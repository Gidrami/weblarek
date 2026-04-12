import { ICartRemoveEventData, IOrder, IProduct } from "../../types";
import { API_URL, events as appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { AppApi } from "../api/AppApi";
import { Api } from "../base/Api";
import { EventEmitter, IEvents } from "../base/Events";
import { Buyer } from "../Models/Buyer";
import { Cart } from "../Models/Cart";
import { Products } from "../Models/Product";
import { CartView } from "../Views/CartView";
import { CatalogCardPreviewView } from "../Views/CatalogCardPreviewView";
import { CatalogGalleryView } from "../Views/CatalogGalleryView";
import { OrderFirstStepFormView } from "../Views/OrderFirstStepFormView";
import { HeaderView } from "../Views/HeaderView";
import { ModalView } from "../Views/ModalView";
import { OrderSecondStepFormView } from "../Views/OrderSecondStepFormView";
import { OrderCreatedView } from "../Views/OrderCreatedView";

export class MainPresenter {
  private readonly events: IEvents;
  private readonly cart = new Cart();
  private readonly buyer = new Buyer();
  private readonly products = new Products();
  private readonly appApi: AppApi;

  private readonly headerView: HeaderView;
  private readonly catalogGalleryView: CatalogGalleryView;
  private readonly modal: ModalView;

  constructor() {
    this.events = new EventEmitter();
    const api = new Api(API_URL);
    this.appApi = new AppApi(api);

    this.headerView = new HeaderView(
      this.events,
      document.querySelector(".header") as HTMLElement,
    );
    this.catalogGalleryView = new CatalogGalleryView(this.events, []);

    const modalRoot = ensureElement<HTMLElement>("#modal-container");
    const modalContent = ensureElement(".modal__content", modalRoot);
    this.modal = new ModalView(modalRoot, modalContent);

    this.events.on(
      appEvents.PRODUCT_SELECT,
      this.openProductPreview.bind(this),
    );
    this.events.on(appEvents.CART_OPEN, this.openBasket.bind(this));
    this.events.on(appEvents.CART_ADD, this.onCartAdd.bind(this));
    this.events.on(appEvents.CART_REMOVE, this.onCartRemove.bind(this));
    this.events.on(appEvents.ORDER_OPEN, this.showOrderForm.bind(this));
  }

  private onCartRemove(data: ICartRemoveEventData) {
    this.cart.removeItem(data.product);
    this.updateHeader(data.updateCart);

    if (!data.updateCart) {
      this.modal.close();
    }
  }

  private onCartAdd(product: IProduct) {
    if (!this.cart.hasItem(product.id)) {
      this.cart.addItem(product);
    }
    this.updateHeader(false);
    this.modal.close();
  }

  private updateHeader(updateCart: boolean): void {
    this.headerView.render({ counter: this.cart.getItemCount() });

    if (updateCart) {
      const basket = new CartView(this.events, this.cart.getItems());
      this.modal.setContent(basket.render());
    }
  }

  private openProductPreview(product: IProduct): void {
    const preview = new CatalogCardPreviewView(
      this.events,
      product,
      this.cart.hasItem(product.id),
    );
    this.modal.setContent(preview.render());
    this.modal.open();
  }

  private openBasket(): void {
    const basket = new CartView(this.events, this.cart.getItems());
    this.modal.setContent(basket.render());
    this.modal.open();
  }

  private showOrderForm(): void {
    const form = new OrderSecondStepFormView((data) => {
      this.buyer.setData(data);
      this.showContactsForm();
    });
    this.modal.setContent(form.container);
  }

  private showContactsForm(): void {
    const form = new OrderFirstStepFormView((data) => {
      this.buyer.setData(data);
      void this.submitOrder();
    });
    this.modal.setContent(form.container);
  }

  private async submitOrder(): Promise<void> {
    const buyerData = this.buyer.getData();
    const errors = this.buyer.validate();
    if (Object.keys(errors).length > 0) {
      console.error("Ошибка валидации:", errors);
      return;
    }

    const order: IOrder = {
      ...buyerData,
      total: this.cart.getTotalPrice(),
      items: this.cart.getItems().map((item) => item.id),
    };

    const response = await this.appApi.createOrder(order);
    const success = new OrderCreatedView(response.total, () => {
      this.modal.close();
      this.cart.clear();
      this.buyer.clear();
      this.updateHeader(false);
    });
    this.modal.setContent(success.container);
  }

  async reload(): Promise<void> {
    const productsResponse = await this.appApi.getProducts();
    this.products.setItems(productsResponse.items);
    this.catalogGalleryView.render({ items: productsResponse.items });
    this.updateHeader(false);
  }
}
