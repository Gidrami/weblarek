import { ICartRemoveEventData, IProduct } from "../../types";
import {
  CDN_URL,
  events as appEvents,
  categoryMap,
} from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class CardPreviewView extends Component<IProduct> {
  private readonly basketButton: HTMLButtonElement;

  constructor(
    private readonly events: IEvents,
    product: IProduct,
    private readonly inCart: boolean,
  ) {
    super(product, cloneTemplate("#card-preview"));
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.basketButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.state.price === null) {
        return;
      }

      if (inCart) {
        this.events.emit(appEvents.CART_REMOVE, {
          product: this.state,
          updateCart: false,
        } as ICartRemoveEventData);
      } else {
        this.events.emit(appEvents.CART_ADD, this.state);
      }
    });
  }

  protected setValues(): void {
    const cardCategory = this.container.querySelector(
      ".card__category",
    ) as HTMLElement;
    const cardTitle = this.container.querySelector(
      ".card__title",
    ) as HTMLElement;
    const cardText = this.container.querySelector(".card__text") as HTMLElement;
    const cardImage = this.container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    const cardPrice = this.container.querySelector(
      ".card__price",
    ) as HTMLElement;

    const categoryClass =
      categoryMap[this.state.category as keyof typeof categoryMap] ??
      "card__category_other";
    cardCategory.className = `card__category ${categoryClass}`;
    cardCategory.textContent = this.state.category;
    cardTitle.textContent = this.state.title;
    cardText.textContent = this.state.description;
    this.setImage(cardImage, `${CDN_URL}${this.state.image}`, this.state.title);

    const withoutPrice = this.state.price === null;
    cardPrice.textContent = withoutPrice
      ? "Бесценно"
      : `${this.state.price} синапсов`;
    this.basketButton.disabled = withoutPrice;

    if (withoutPrice) {
      this.basketButton.textContent = "Недоступно";

      return;
    }

    if (this.inCart) {
      this.basketButton.textContent = "Удалить из корзины";
    } else {
      this.basketButton.textContent = "В корзину";
    }
  }
}
