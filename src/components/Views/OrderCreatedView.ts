import { IOrderCreatedViewModel } from "../../types"
import { events as appEvents } from '../../utils/constants'
import { ensureElement } from "../../utils/utils"
import { Component } from "../base/Component"
import { IEvents } from '../base/Events'

export class OrderCreatedView extends Component<IOrderCreatedViewModel> {
  private contentElement!: HTMLElement;
  private btnElement!: HTMLButtonElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.initializeElements();
    this.addEventListeners();
  }

  private initializeElements() {
    this.contentElement = ensureElement(
      ".order-success__description",
      this.container,
    );
    this.btnElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
  }

  private addEventListeners() {
    this.btnElement.addEventListener("click", () => {
      this.events.emit(appEvents.ORDER_COMPLETED);
    });
  }

  set total(value: number) {
    this.contentElement.textContent = `Списано ${value} синапсов`;
  }
}
