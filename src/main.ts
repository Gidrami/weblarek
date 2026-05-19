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
  IBuyer,
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

let cartCardElements: HTMLElement[] = [];

const catalog = new CatalogGalleryView(ensureElement(".gallery"));

// Events
events.on(appEvents.PRODUCTS_CHANGED, onProductsChanged);
events.on(appEvents.PRODUCTS_ITEM_SELECTED, onOpenProductPreview);
events.on(appEvents.PRODUCTS_SELECTED_ITEM_CLEARED, onSelectedItemCleared);
events.on(appEvents.CART_OPEN, onOpenCart);
events.on(appEvents.CART_ITEM_ADDED, onCartChanged);
events.on(appEvents.CART_ITEM_REMOVED, onCartItemRemoved);
events.on(appEvents.CART_CLEARED, onCartCleared);
events.on(appEvents.ORDER_FIRST_FORM_OPEN, onFirstFormOpen);
events.on(appEvents.ORDER_FIRST_FORM_FILLED, onFirstFormFilled);
events.on(appEvents.BUYER_CHANGE, onBuyerChange);
events.on(appEvents.BUYER_CHANGED, onBuyerChanged);
events.on(
  appEvents.ORDER_SECOND_FORM_FILLED,
  async (data: IOrderSecondStepFilledEvent) => await onOrderCreate(data),
);
events.on(appEvents.ORDER_COMPLETED, () => modalView.close());

function onSelectedItemCleared() {
  modalView.close();
}

function onFirstFormFilled() {
  const element = secondStepFormView.render();

  modalView.render({ element });
}

function onBuyerChange(data: Partial<IBuyer>) {
  buyer.setData(data);
}

function onBuyerChanged() {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  if (buyerData.address) {
    firstStepFormView.address = buyerData.address;
  }

  if (buyerData.payment) {
    firstStepFormView.payment = buyerData.payment;
  }

  if (buyerData.email) {
    secondStepFormView.email = buyerData.email;
  }

  if (buyerData.phone) {
    secondStepFormView.phone = buyerData.phone;
  }

  firstStepFormView.errors = errors;
  firstStepFormView.valid = !errors.address && !errors.payment;

  secondStepFormView.errors = errors;
  secondStepFormView.valid = !errors.email && !errors.phone;
}

function onProductsChanged() {
  const elements = products.getItems().map((p) =>
    new CatalogCardView(cloneTemplate("#card-catalog"), {
      onClick: () => products.setSelectedItem(p),
    }).render({ ...p }),
  );
  catalog.render({ elements });
}

function addOrRemoveSelectedItem() {
  const selectedItem = products.getSelectedItem()!;

  if (!cart.hasItem(selectedItem.id)) {
    cart.addItem(selectedItem);
  } else {
    cart.removeItem(selectedItem);
  }

  products.clearSelectedItem();
}

function onCartChanged() {
  headerView.render({ counter: cart.getItemCount() });

  cartCardElements = cart.getItems().map((p, i) =>
    new CartCardView(cloneTemplate("#card-basket"), {
      onClick: () => cart.removeItem(p),
    }).render({
      index: i + 1,
    }),
  );
}

function onCartItemRemoved() {
  cartCardElements = cart.getItems().map((p, i) =>
    new CartCardView(cloneTemplate("#card-basket"), {
      onClick: () => cart.removeItem(p),
    }).render({
      index: i + 1,
    }),
  );
  const element = cartView.render({
    elements: cartCardElements,
    price: cart.getTotalPrice(),
  } satisfies ICartViewModel);

  headerView.render({ counter: cart.getItemCount() });
  modalView.render({ element });
}

function onCartCleared() {
  buyer.clear();
  headerView.render({ counter: cart.getItemCount() });
  modalView.close();
}

function onOpenProductPreview(): void {
  const cardCardPreviewView = new CatalogCardPreviewView(
    cloneTemplate("#card-preview"),
    { onClick: () => addOrRemoveSelectedItem() },
  );

  cardCardPreviewView.inCart = cart.hasItem(products.getSelectedItem()!.id);

  modalView.render({ element: cardCardPreviewView.render() });
  modalView.open();
}

function onOpenCart(): void {
  const element = cartView.render({
    elements: cartCardElements,
    price: cart.getTotalPrice(),
  } satisfies ICartViewModel);

  modalView.render({ element });
  modalView.open();
}

function onFirstFormOpen() {
  const element = firstStepFormView.render();

  modalView.render({ element });
}

async function onOrderCreate(): Promise<void> {
  const buyerData = buyer.getData();

  try {
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

    cart.clear();
    buyer.clear();
  } catch (err) {
    console.error(err);
  }
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
