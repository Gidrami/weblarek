import { AppApi } from "./components/api/AppApi";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Products } from "./components/Models/Product";
import { CartCardView } from "./components/Views/CartCardView";
import { CartView } from "./components/Views/CartView";
import { CatalogCardPreviewView } from "./components/Views/CatalogCardPreviewView";
import { CatalogGalleryView } from "./components/Views/CatalogGalleryView";
import { HeaderView } from "./components/Views/HeaderView";
import { ModalView } from "./components/Views/ModalView";
import { OrderCreatedView } from "./components/Views/OrderCreatedView";
import { OrderSecondStepFormView } from "./components/Views/OrderSecondStepFormView";
import { OrderFirstStepFormView } from "./components/Views/OrderFirstStepFormView";
import "./scss/styles.scss";
import {
  IBuyer,
  ICartRemoveEventData,
  ICatalogCardPreviewViewModel,
  ICatalogCardSelectedEvent,
  IOrder,
  IOrderFirstStepFilledEvent,
  IOrderSecondStepFilledEvent,
  IProduct,
  ICartViewModel,
} from "./types";
import { API_URL, events as appEvents } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CatalogCardView } from "./components/Views/CatalogCardView";

const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);
const productsResponse = await appApi.getProducts();

// Models
const cart = new Cart(events);
const buyer = new Buyer();
const products = new Products();

products.setItems(productsResponse.items);

// Events
events.on(appEvents.PRODUCT_SELECT, onOpenProductPreview);
events.on(appEvents.CART_OPEN, onOpenCart);
events.on(appEvents.CART_ADD_OR_REMOVE, onCartAdd);
events.on(appEvents.CART_REMOVE, onCartRemove);
events.on(appEvents.CART_CHANGED, onCartChanged);
events.on(appEvents.CART_CLEARED, onCartCleared);
events.on(appEvents.ORDER_FIRST_FORM_OPEN, onFirstFormOpen);
events.on(appEvents.ORDER_FIRST_FORM_FILLED, onOrderFirstFormFilled);
events.on(
  appEvents.ORDER_CREATE,
  async (data: IOrderSecondStepFilledEvent) => await onOrderCreate(data),
);

// Views
const headerView = new HeaderView(events, ensureElement(".header"));
const modalView = new ModalView(ensureElement("#modal-container"));
const firstStepFormView = new OrderSecondStepFormView(
  events,
  cloneTemplate("#contacts"),
);
const secondStepFormView = new OrderFirstStepFormView(
  events,
  cloneTemplate("#order"),
);
const cardCardPreviewView = new CatalogCardPreviewView(
  events,
  cloneTemplate("#card-preview"),
);
const cartCardView = new CartCardView(events, cloneTemplate("#card-basket"));
const cartView = new CartView(events, cloneTemplate("#basket"));
const orderCreatedView = new OrderCreatedView(cloneTemplate("#success"));

const catalog = new CatalogGalleryView(events, ensureElement(".gallery"));

const elements = products.getItems().map((p) =>
  new CatalogCardView(events, cloneTemplate("#card-catalog")).render({
    product: p,
  }),
);
catalog.render({ elements });

function onCartRemove(data: ICartRemoveEventData) {
  cart.removeItem(data.product);
}

function onCartAdd() {
  const selectedItem = products.getSelectedItem()

  if (!selectedItem) {
    return;
  }

  if (!cart.hasItem(selectedItem.id)) {
    cart.addItem(selectedItem);
  } else {
    cart.removeItem(selectedItem)
  }
}

function onCartChanged() {
  headerView.render({ counter: cart.getItemCount() });
  modalView.render({});
}

function onCartCleared() {
  cart.clear();
  buyer.clear();
  headerView.render({ counter: cart.getItemCount() });
  modalView.close();
}

function onOpenProductPreview(data: ICatalogCardSelectedEvent): void {
  products.setSelectedItem(products.getItemById(data.productId)!)
  const element = cardCardPreviewView.render({
    product: products.getSelectedItem()!,
    inCart: cart.hasItem(data.productId),
  } satisfies ICatalogCardPreviewViewModel);
  modalView.render({ element });
  modalView.open();
}

function onOpenCart(): void {
  const cartElements = cart.getItems().map((p, i) =>
    cartCardView.render({
      index: i,
      product: p,
    }),
  );
  const element = cartView.render({
    elements: cartElements,
    price: cart.getTotalPrice(),
  } satisfies ICartViewModel);

  modalView.render({ element });
  modalView.open();
}

function onFirstFormOpen() {
  const element = firstStepFormView.render();

  modalView.render({ element });
}

function onOrderFirstFormFilled(data: IOrderFirstStepFilledEvent): void {
  buyer.setData(data);

  const element = secondStepFormView.render();

  modalView.render({ element });
}

async function onOrderCreate(data: IOrderSecondStepFilledEvent): Promise<void> {
  buyer.setData(data);
  const buyerData = buyer.getData();
  const errors = buyer.validate();
  if (Object.keys(errors).length > 0) {
    console.error("Ошибка валидации:", errors);
    return;
  }

  const order: IOrder = {
    ...buyerData,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  const response = await appApi.createOrder(order);
  const modalContent = orderCreatedView.render({
    total: response.total,
  });
  modalView.render({
    element: modalContent,
  });
}
