import { IModalViewModel } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class ModalView extends Component<IModalViewModel> {
  private closeButton!: HTMLButtonElement;
  private content!: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.initializeElements();
    this.addEventListeners();
  }

  set element(value: HTMLElement) {
    this.content.replaceChildren(value);
  }

  get opened(): boolean {
    return this.container.classList.contains("modal_active");
  }

  public open(): void {
    this.container.classList.add("modal_active");
  }

  public close(): void {
    this.container.classList.remove("modal_active");
  }

  private initializeElements() {
    this.content = ensureElement(".modal__content", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
  }

  private addEventListeners() {
    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("mousedown", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }
}
