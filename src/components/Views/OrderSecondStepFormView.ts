import {
  IBuyer,
  IOrder,
  IOrderFirstStepFilledEvent,
  IOrderFirstStepFormViewModel,
  IOrderSecondStepFilledEvent,
  IOrderSecondStepFormViewModel,
} from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { events as appEvents } from "../../utils/constants";

export class OrderSecondStepFormView extends Component<IOrderSecondStepFormViewModel> {
  private formElement!: HTMLFormElement;
  private emailElement!: HTMLInputElement;
  private phoneElement!: HTMLInputElement;
  private submitBtnElement!: HTMLButtonElement;

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
  }

  addEventListeners() {
    this.emailElement.addEventListener("input", () => this.syncSubmitState());
    this.phoneElement.addEventListener("input", () => this.syncSubmitState());
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = this.emailElement.value;
      const phone = this.phoneElement.value;
      this.events.emit(appEvents.ORDER_FIRST_FORM_FILLED, {
        email,
        phone,
      } satisfies IOrderSecondStepFilledEvent);
    });
  }

  private isValid(): boolean {
    return (
      this.emailElement.value.trim().length > 0 &&
      this.phoneElement.value.trim().length > 0
    );
  }

  private syncSubmitState(): void {
    if (!this.isValid) {
      this.submitBtnElement.disabled = true;
    }
  }
}
