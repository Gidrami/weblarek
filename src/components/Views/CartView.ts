import { IHeaderViewModel, IProduct } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CartCardView } from "./CartCardView";

export class CartView extends Component<IHeaderViewModel> {
  private priceElement!: HTMLElement;
  private listElement!: HTMLElement;
  private orderButtonElement!: HTMLButtonElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements()
    this.addEventListeners()
  }

  set elements(values: HTMLElement[]) {
    this.listElement.replaceChildren(...values);
    this.orderButtonElement.disabled = values.length === 0;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  initializeElements() {
    this.priceElement = ensureElement(".basket__price", this.container)
    this.listElement = ensureElement(".basket__list", this.container);
    this.orderButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
  }

  addEventListeners() {
    this.orderButtonElement.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit(appEvents.ORDER_FIRST_FORM_OPEN, {});
    });
  }
}
