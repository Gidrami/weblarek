import { ICartRemoveEventData, ICatalogCardPreviewViewModel, IProduct } from "../../types";
import {
  CDN_URL,
  events as appEvents,
  categoryMap,
} from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class CatalogCardPreviewView extends Component<ICatalogCardPreviewViewModel> {
  private cardCategory!: HTMLElement;
  private cardTitle!: HTMLElement;
  private cardText!: HTMLElement;
  private cardImage!: HTMLImageElement;
  private cardPrice!: HTMLElement;
  private basketButton!: HTMLButtonElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    this.cardCategory = ensureElement(
      ".card__category",
      this.container
    );
    this.cardTitle = ensureElement(
      ".card__title",
      this.container
    );
    this.cardText = ensureElement(".card__text", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.cardPrice = ensureElement(".card__price", this.container);
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
  }

  set product(value: IProduct) {
    this.product = value;
    const categoryClass =
      categoryMap[value.category as keyof typeof categoryMap] ??
      "card__category_other";
    this.cardCategory.className = `card__category ${categoryClass}`;
    this.cardCategory.textContent = value.category;
    this.cardTitle.textContent = value.title;
    this.cardText.textContent = value.description;
    this.setImage(this.cardImage, `${CDN_URL}${value.image}`, value.title);

    const withoutPrice = value.price === null;
    this.cardPrice.textContent = withoutPrice
      ? "Бесценно"
      : `${value.price} синапсов`;
    this.basketButton.disabled = withoutPrice;

    if (withoutPrice) {
      this.basketButton.textContent = "Недоступно";
    }
  }

  set inCart(value: boolean) {
    if (value) {
      this.basketButton.textContent = "Удалить из корзины";
    } else {
      this.basketButton.textContent = "В корзину";
    }
  }

  addEventListeners() {
    this.basketButton.addEventListener("click", (e) => {
      e.stopPropagation();
        this.events.emit(appEvents.CART_REMOVE, {
          product: this.product,
          updateCart: false,
        })
    });
  }
}
