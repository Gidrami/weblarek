import { IOrderCreatedViewModel } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class OrderCreatedView extends Component<IOrderCreatedViewModel> {
  private contentElement!: HTMLElement;

  constructor(
    container: HTMLElement,
  ) {
    super(container);
    this.initializeElements();
  }

  private initializeElements() {
    this.contentElement = ensureElement(
      ".order-success__description",
      this.container,
    );
  }

  set total(value: number) {
    this.contentElement.textContent = `Списано ${value} синапсов`;
  }
}
