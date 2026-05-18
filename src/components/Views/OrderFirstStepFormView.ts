import {
    IOrderFirstStepFilledEvent,
    TPayment,
} from "../../types";
import { events as appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class OrderFirstStepFormView extends Component<IOrderFirstStepFilledEvent> {
  private formElement!: HTMLFormElement;
  private cardBtnElement!: HTMLButtonElement;
  private cashBtnElement!: HTMLButtonElement;
  private addressElement!: HTMLInputElement;
  private submitBtnElement!: HTMLButtonElement;
  

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();

  }

  initializeElements() {
    this.formElement = this.container as HTMLFormElement;
    this.cardBtnElement = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.formElement,
    );
    this.cashBtnElement = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.formElement,
    );
    this.addressElement = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.formElement,
    );
    this.submitBtnElement = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.formElement,
    );
  }

  addEventListeners() {
  this.cardBtnElement.addEventListener("click", () => {
    this.events.emit(appEvents.ORDER_PAYMENT_CHANGED, {
      payment: "online",
    });
  });

  this.cashBtnElement.addEventListener("click", () => {
    this.events.emit(appEvents.ORDER_PAYMENT_CHANGED, {
      payment: "cash",
    });
  });

  this.addressElement.addEventListener("input", () => {
    this.events.emit(appEvents.ORDER_ADDRESS_CHANGED, {
      address: this.addressElement.value,
    });
  });

  this.formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    this.events.emit(appEvents.ORDER_FIRST_FORM_FILLED);
  });
}
set payment(value: TPayment) {
  this.cardBtnElement.classList.toggle(
    "button_alt-active",
    value === "online"
  );

  this.cashBtnElement.classList.toggle(
    "button_alt-active",
    value === "cash"
  );
}

set valid(value: boolean) {
  this.submitBtnElement.disabled = !value;
}};