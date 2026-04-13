import { ICartViewModel } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class HeaderView extends Component<ICartViewModel> {
  protected counterElement!: HTMLElement;
  protected basketButton!: HTMLButtonElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements()
    this.addEventListeners()
  }

  set counter(value: number) {
    this.counterElement.textContent = value.toString();
  }

  addEventListeners() {
    this.basketButton.addEventListener("click", () => {
      this.events.emit(appEvents.CART_OPEN, {});
    });
  }

  initializeElements() {
    this.counterElement = ensureElement(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
  }
}
