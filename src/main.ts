import { AppApi } from "./components/api/AppApi";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Products } from "./components/Models/Products";
import { CartCardView } from "./components/Views/CartCardView";
import { CartView } from "./components/Views/CartView";
import { CatalogCardPreviewView } from "./components/Views/CatalogCardPreviewView";
import { CatalogCardView } from "./components/Views/CatalogCardView";
import { CatalogGalleryView } from "./components/Views/CatalogGalleryView";
import { HeaderView } from "./components/Views/HeaderView";
import { ModalView } from "./components/Views/ModalView";
import { OrderCreatedView } from "./components/Views/OrderCreatedView";
import { OrderFirstStepFormView } from "./components/Views/OrderFirstStepFormView";
import { OrderSecondStepFormView } from "./components/Views/OrderSecondStepFormView";
import "./scss/styles.scss";
import {
  ICartViewModel,
  ICatalogCardPreviewViewModel,
  ICatalogCardSelectedEvent,
  IOrder,
  IOrderFirstStepFilledEvent,
  IOrderSecondStepFilledEvent,
  IProduct,
} from "./types";
import { API_URL, events as appEvents } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);

// Models
const cart = new Cart(events);
const buyer = new Buyer(events);
const products = new Products(events);

// Views
const headerView = new HeaderView(events, ensureElement(".header"));
const modalView = new ModalView(ensureElement("#modal-container"));
const firstStepFormView = new OrderFirstStepFormView(
  events,
  cloneTemplate("#order"),
);
const secondStepFormView = new OrderSecondStepFormView(
  events,
  cloneTemplate("#contacts"),
);

const cartView = new CartView(events, cloneTemplate("#basket"));
const orderCreatedView = new OrderCreatedView(
  events,
  cloneTemplate("#success"),
);

const catalog = new CatalogGalleryView(ensureElement(".gallery"));

// Events
events.on(appEvents.PRODUCTS_CHANGED, onProductsChanged);
events.on(appEvents.PRODUCT_SELECTED, onOpenProductPreview);
events.on(appEvents.CART_OPEN, onOpenCart);
events.on(appEvents.CART_ADD_OR_REMOVE, () => onCartAddOrRemoveSelectedItem(false));
events.on(appEvents.CART_CHANGED, onCartChanged);
events.on(appEvents.CART_CLEARED, onCartCleared);
events.on(appEvents.ORDER_FIRST_FORM_OPEN, onFirstFormOpen);
events.on(appEvents.ORDER_FIRST_FORM_FILLED, onOrderFirstFormFilled);
events.on(
  appEvents.ORDER_SECOND_FORM_FILLED,
  async (data: IOrderSecondStepFilledEvent) => await onOrderCreate(data),
);
events.on(appEvents.ORDER_COMPLETED, () => modalView.close());

function onProductsChanged() {
  const elements = products
    .getItems()
    .map((p) =>
      new CatalogCardView(cloneTemplate("#card-catalog"), {
        onClick: () => products.setSelectedItem(p),
      }).render({ ...p }),
    );
  catalog.render({ elements });
}

function onCartAddOrRemoveSelectedItem(closeModal: boolean) {
  const selectedItem = products.getSelectedItem()!;

  if (!cart.hasItem(selectedItem.id)) {
    cart.addItem(selectedItem);
  } else {
    cart.removeItem(selectedItem);
  }

  if (closeModal) {
    modalView.close();
  }
}

function onCartChanged() {
  headerView.render({ counter: cart.getItemCount() });
  modalView.close();
}

function onCartCleared() {
  buyer.clear();
  headerView.render({ counter: cart.getItemCount() });
  modalView.close();
}

function onOpenProductPreview(product: IProduct): void {
  const cardCardPreviewView = new CatalogCardPreviewView(
    cloneTemplate("#card-preview"),
    { onClick: () => onCartAddOrRemoveSelectedItem(true) },
  );

  cardCardPreviewView.inCart = cart.hasItem(product.id);

  modalView.render({ element: cardCardPreviewView.render() });
  modalView.open();
}

function onOpenCart(): void {
  const cartElements = cart.getItems().map((p, i) =>
    new CartCardView(cloneTemplate("#card-basket")).render({
      index: i + 1,
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
  cart.clear();
  const modalContent = orderCreatedView.render({
    total: response.total,
  });
  modalView.render({
    element: modalContent,
  });
  modalView.open();
}

async function init() {
  try {
    const productsResponse = await appApi.getProducts();

    products.setItems(productsResponse.items);
  } catch (err) {
    console.error(err);
  }
}

init();
