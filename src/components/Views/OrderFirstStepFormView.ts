import {
  IBuyer,
  IOrderFirstStepFilledEvent,
  PartialBuyer,
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
  private formErrorsElement!: HTMLSpanElement;

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
    this.formErrorsElement = ensureElement<HTMLSpanElement>(
      ".form__errors",
      this.formElement,
    );
  }

  addEventListeners() {
    this.cardBtnElement.addEventListener("click", () => {
      this.events.emit(appEvents.BUYER_CHANGE, {
        payment: "online",
      } satisfies Partial<IBuyer>);
    });

    this.cashBtnElement.addEventListener("click", () => {
      this.events.emit(appEvents.BUYER_CHANGE, {
        payment: "cash",
      } satisfies Partial<IBuyer>);
    });

    this.addressElement.addEventListener("input", () => {
      this.events.emit(appEvents.BUYER_CHANGE, {
        address: this.addressElement.value,
      } satisfies Partial<IBuyer>);
    });

    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();

      this.events.emit(appEvents.ORDER_FIRST_FORM_FILLED);
    });
  }
  set payment(value: TPayment) {
    this.cardBtnElement.classList.toggle(
      "button_alt-active",
      value === "online",
    );

    this.cashBtnElement.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: IBuyer["address"]) {
    this.addressElement.value = value;
  }

  set errors(value: PartialBuyer) {
    let errorsText = "";

    if (value.payment) {
      errorsText += "Тип оплаты не выбран\n";
    }

    if (value.address) {
      errorsText += "Адрес не заполнен";
    }
    this.formErrorsElement.textContent = errorsText;
  }

  set valid(value: boolean) {
    this.submitBtnElement.disabled = !value;
  }
}
