import {
  IBuyer,
  IOrderFirstStepFilledEvent,
  IOrderSecondStepFormViewModel,
  TPayment,
} from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { events as appEvents } from "../../utils/constants";

export class OrderFirstStepFormView extends Component<IOrderFirstStepFilledEvent> {
  private formElement!: HTMLFormElement;
  private cardBtnElement!: HTMLButtonElement;
  private cashBtnElement!: HTMLButtonElement;
  private addressElement!: HTMLInputElement;
  private submitBtnElement!: HTMLButtonElement;
  private payment: TPayment = null;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();

    this.syncSubmitState();
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
    this.cardBtnElement.addEventListener("click", () =>
      this.selectPayment("online"),
    );
    this.cashBtnElement.addEventListener("click", () =>
      this.selectPayment("cash"),
    );
    this.addressElement.addEventListener("input", () => this.syncSubmitState());

    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const address = this.addressElement.value;
      this.events.emit(appEvents.ORDER_FIRST_FORM_FILLED, {
        address,
        payment: this.payment!,
      } satisfies IOrderFirstStepFilledEvent);
    });
  }

  private selectPayment(method: "online" | "cash"): void {
    this.payment = method;
    this.cardBtnElement.classList.toggle(
      "button_alt-active",
      method === "online",
    );
    this.cashBtnElement.classList.toggle(
      "button_alt-active",
      method === "cash",
    );
    this.syncSubmitState();
  }

  private isValid(): boolean {
    return this.payment !== null && this.addressElement.value.trim().length > 0;
  }

  private syncSubmitState(): void {
    if (!this.isValid) {
      this.submitBtnElement.disabled = true;
    }
  }
}
