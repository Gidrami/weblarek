import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasketViewModel {
  counter: number
}

export class HeaderViewComponent extends Component<IBasketViewModel> {
  protected counterElement: HTMLElement
  protected basketButton: HTMLButtonElement

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.counterElement = ensureElement('.header__basket-counter', this.container)
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = value.toString()
  }
}