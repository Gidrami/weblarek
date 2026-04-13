import { ICartCardState, ICartRemoveEventData, IProduct } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class CartCardView extends Component<ICartCardState> {
  private deleteBtnElement!: HTMLButtonElement;
  private indexElement!: HTMLElement;
  private titleElement!: HTMLElement;
  private priceElement!: HTMLElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    this.indexElement = ensureElement(".basket__item-index", this.container);
    this.titleElement = ensureElement(".card__title", this.container);
    this.priceElement = ensureElement(".card__price", this.container);
    this.deleteBtnElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
  }

  addEventListeners() {
    this.deleteBtnElement.addEventListener("click", (e) => {
      e.stopPropagation();
      this.events.emit(appEvents.CART_REMOVE, {
        product: this.product,
        updateCart: true,
      } as ICartRemoveEventData);
    });
  }

  set product(value: IProduct) {
    this.titleElement.textContent = value.title;
    this.priceElement.textContent =
      value.price === null
        ? "Бесценно"
        : `${value.price} синапсов`;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
