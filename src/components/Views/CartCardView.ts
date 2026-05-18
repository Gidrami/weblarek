import { ICartCardState } from "../../types"
import { ensureElement } from "../../utils/utils"
import { Card } from "./Card"


export class CartCardView extends Card<ICartCardState> {
  private deleteBtnElement!: HTMLButtonElement;
  private indexElement!: HTMLElement;

  constructor(
    container: HTMLElement,
    actions?: {
      onClick: () => void;
    }
  ) {
    super(container);

    this.initializeElements();

    this.deleteBtnElement.addEventListener("click", (e) => {
      e.stopPropagation();

      actions?.onClick();
    });
  }

  initializeElements() {
    this.indexElement = ensureElement(".basket__item-index", this.container);
    this.deleteBtnElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
  }


  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
