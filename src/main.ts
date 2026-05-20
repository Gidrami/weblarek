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
import { IBuyer, IOrder } from "./types";
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

const catalogView = new CatalogGalleryView(ensureElement(".gallery"));

const cardCardPreviewView = new CatalogCardPreviewView(
    cloneTemplate("#card-preview"),
    { onClick: () => addOrRemoveSelectedItem() },
  );

// Events
events.on(appEvents.PRODUCTS_CHANGED, onProductsChanged);
events.on(appEvents.PRODUCTS_ITEM_SELECTED, onOpenProductPreview);
events.on(appEvents.PRODUCTS_SELECTED_ITEM_CLEARED, onSelectedItemCleared);
events.on(appEvents.CART_OPEN, onOpenCart);
events.on(appEvents.CART_ITEM_ADDED, onCartChanged);
events.on(appEvents.CART_ITEM_REMOVED, onCartItemRemoved);
events.on(appEvents.CART_CLEARED, onCartCleared);
events.on(appEvents.ORDER_FIRST_FORM_OPEN, onFirstFormOpen);
events.on(appEvents.ORDER_SECOND_FORM_OPEN, onSecondFormOpen);
events.on(appEvents.BUYER_CHANGE, onBuyerChange);
events.on(appEvents.BUYER_CHANGED, onBuyerChanged);
events.on(
  appEvents.ORDER_SECOND_FORM_FILLED,
  async () => await onOrderCreate(),
);
events.on(appEvents.ORDER_COMPLETED, onOrderCompleted);

function onOrderCompleted() {
  cart.clear();
  buyer.clear();
  modalView.close();
}

function onSelectedItemCleared() {
  modalView.close();
}

function onSecondFormOpen() {
  const buyerData = buyer.getData()

  secondStepFormView.email = buyerData.email
  secondStepFormView.phone = buyerData.phone

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
  catalogView.render({ elements });
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

  cartView.elements = cart.getItems().map((p, i) =>
    new CartCardView(cloneTemplate("#card-basket"), {
      onClick: () => cart.removeItem(p),
    }).render({
      index: i + 1,
      price: p.price,
      title: p.title,
    }),
  );
  cartView.price = cart.getTotalPrice()
}

function onCartItemRemoved() {
  cartView.elements = cart.getItems().map((p, i) =>
    new CartCardView(cloneTemplate("#card-basket"), {
      onClick: () => cart.removeItem(p),
    }).render({
      index: i + 1,
      price: p.price,
      title: p.title,
    }),
  );

  headerView.render({ counter: cart.getItemCount() });
  modalView.render({ element: cartView.render() });
}

function onCartCleared() {
  headerView.render({ counter: cart.getItemCount() });
  
  cartView.elements = [];
  cartView.price = 0

  modalView.close();
}

function onOpenProductPreview(): void {
  const selectedItem = products.getSelectedItem();

  modalView.render({
    element: cardCardPreviewView.render({
      ...selectedItem,
      inCart: cart.hasItem(selectedItem!.id),
    }),
  });
  modalView.open();
}

function onOpenCart(): void {
  modalView.render({ element: cartView.render() });
  modalView.open();
}

function onFirstFormOpen() {
  const buyerData = buyer.getData()

  firstStepFormView.address = buyerData.address
  firstStepFormView.payment = buyerData.payment

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
