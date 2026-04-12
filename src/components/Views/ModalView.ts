import { ensureElement } from "../../utils/utils";

export class ModalView {
  private readonly closeButton: HTMLButtonElement;

  constructor(
    private readonly container: HTMLElement,
    private readonly contentRoot: HTMLElement,
  ) {
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("mousedown", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  setContent(children: HTMLElement): void {
    this.contentRoot.replaceChildren(children);
  }

  get opened(): boolean {
    return this.container.classList.contains("modal_active");
  }
}
