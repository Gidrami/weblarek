import { ICatalogCardPreviewViewModel, IProduct } from "../../types"
import {
  CDN_URL,
  categoryMap,
} from "../../utils/constants"
import { ensureElement } from "../../utils/utils"
import { Card } from "./Card";

export class CatalogCardPreviewView extends Card<ICatalogCardPreviewViewModel> {
  private cardCategory!: HTMLElement;
  private cardTitle!: HTMLElement;
  private cardText!: HTMLElement;
  private cardImage!: HTMLImageElement;
  private cardPrice!: HTMLElement;
  private basketButton!: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: {
      onClick: () => void;
    }
  ) {
    super(container);

    this.initializeElements();
    this.basketButton.addEventListener("click", (e) => {
      e.stopPropagation();

      actions?.onClick();
    });
  }

  initializeElements() {
    this.cardCategory = ensureElement(
      ".card__category",
      this.container
    );
    this.cardTitle = ensureElement(
      ".card__title",
      this.container
    );
    this.cardText = ensureElement(".card__text", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.cardPrice = ensureElement(".card__price", this.container);
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
  }

  set title(value: IProduct['title']) {
    this.cardTitle.textContent = value;
  }

  set description(value: IProduct['description']) {
    this.cardText.textContent = value;
  }

  set image(value: IProduct['image']) {
    this.setImage(this.cardImage, `${CDN_URL}${value}`);
  }

  set category(value: IProduct['category']) {
    const categoryClass =
      categoryMap[value as keyof typeof categoryMap] ??
      "card__category_other";
    this.cardCategory.className = `card__category ${categoryClass}`;
    this.cardCategory.textContent = value;
  }

  set price(value: IProduct['price']) {
    const withoutPrice = value === null;
    this.cardPrice.textContent = withoutPrice
      ? "Бесценно"
      : `${value} синапсов`;
    this.basketButton.disabled = withoutPrice;

    if (withoutPrice) {
      this.basketButton.textContent = "Недоступно";
    }
  }

  set inCart(value: boolean) {
    if (value) {
      this.basketButton.textContent = "Удалить из корзины";
    } else {
      this.basketButton.textContent = "В корзину";
    }
  }
}
