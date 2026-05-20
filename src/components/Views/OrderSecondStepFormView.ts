import {
  IBuyer,
  IOrderSecondStepFormViewModel,
  PartialBuyer,
} from "../../types";
import { events as appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class OrderSecondStepFormView extends Component<IOrderSecondStepFormViewModel> {
  private formElement!: HTMLFormElement;
  private emailElement!: HTMLInputElement;
  private phoneElement!: HTMLInputElement;
  private submitBtnElement!: HTMLButtonElement;
  private formErrorsElement!: HTMLSpanElement;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();

    this.submitBtnElement.disabled = true;
  }

  initializeElements() {
    this.formElement = this.container as HTMLFormElement;
    this.emailElement = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.phoneElement = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
    this.submitBtnElement = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    );
    this.formErrorsElement = ensureElement<HTMLSpanElement>(
      ".form__errors",
      this.formElement,
    );
  }

  addEventListeners() {
    this.emailElement.addEventListener("input", () => {
      this.events.emit(appEvents.BUYER_CHANGE, {
        email: this.emailElement.value,
      } satisfies Partial<IBuyer>);
    });
    this.phoneElement.addEventListener("input", () => {
      this.events.emit(appEvents.BUYER_CHANGE, {
        phone: this.phoneElement.value,
      } satisfies Partial<IBuyer>);
    });
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(appEvents.ORDER_SECOND_FORM_FILLED);
    });
  }

  set email(value: IBuyer["email"]) {
    this.emailElement.value = value;
  }

  set phone(value: IBuyer["phone"]) {
    this.phoneElement.value = value;
  }

  set errors(value: PartialBuyer) {
    let errorsText = "";

    if (value.email) {
      errorsText += "Электронный адрес не заполнен\n";
    }

    if (value.phone) {
      errorsText += "Телефон не заполнен";
    }

    this.formErrorsElement.textContent = errorsText;
  }

  set valid(value: boolean) {
    this.submitBtnElement.disabled = !value;
  }
}
