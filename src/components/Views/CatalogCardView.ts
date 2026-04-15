import { ICatalogCardSelectedEvent, ICatalogCardView, IProduct } from "../../types"
import {
  CDN_URL,
  events as appEvents,
  categoryMap,
} from "../../utils/constants"
import { ensureElement } from "../../utils/utils"
import { Component } from "../base/Component"
import { IEvents } from "../base/Events"

export class CatalogCardView extends Component<ICatalogCardView> {
  private cardCategory!: HTMLElement;
  private cardTitle!: HTMLElement;
  private cardImage!: HTMLImageElement;
  private cardPrice!: HTMLElement;
  private currentProductId: string | null = null;

  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.initializeElements();
    this.addEventListeners();
  }

  set product(value: IProduct) {
    const categoryClass =
      categoryMap[value.category as keyof typeof categoryMap] ??
      "card__category_other";
    this.cardCategory.className = `card__category ${categoryClass}`;
    this.cardCategory.textContent = value.category;
    this.cardTitle.textContent = value.title;
    this.setImage(this.cardImage, `${CDN_URL}${value.image}`, value.title);
    this.cardPrice.textContent =
      value.price === null ? "Бесценно" : `${value.price} синапсов`;
    this.currentProductId = value.id;
  }

  initializeElements() {
    this.cardCategory = ensureElement(".card__category", this.container);
    this.cardTitle = ensureElement(".card__title", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.cardPrice = ensureElement(".card__price", this.container);
  }

  addEventListeners() {
    this.container.addEventListener("click", () => {
      if (!this.currentProductId) {
        return;
      }
      this.events.emit(appEvents.PRODUCT_SELECT, { productId: this.currentProductId } satisfies ICatalogCardSelectedEvent);
    });
  }
}
