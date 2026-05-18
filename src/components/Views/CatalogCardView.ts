import { ICatalogCardView } from "../../types"
import {
  CDN_URL,
  categoryMap,
} from "../../utils/constants"
import { ensureElement } from "../../utils/utils"
import { Card } from "./Card"


export class CatalogCardView extends Card<ICatalogCardView> {
  private cardCategory!: HTMLElement;
  private cardImage!: HTMLImageElement;
  
  constructor(
  container: HTMLElement,
  actions?: {
    onClick: () => void;
  }
) {
    super(container);

    this.initializeElements();
    this.container.addEventListener("click", () => {
  actions?.onClick();
});
  }
   initializeElements() {
    this.cardCategory = ensureElement(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
  }

  set category(value: string) {
    const categoryClass =
      categoryMap[value as keyof typeof categoryMap] ??
      "card__category_other";

    this.cardCategory.className =
      `card__category ${categoryClass}`;

    this.cardCategory.textContent = value;
  }

  set image(value: string) {
    this.setImage(
      this.cardImage,
      `${CDN_URL}${value}`,
      this.titleElement.textContent || ""
    );
  }
}

 
  
