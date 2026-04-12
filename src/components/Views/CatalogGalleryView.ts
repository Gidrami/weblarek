import { ICatalogState, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CatalogCardView } from "./CatalogCardView";

export class CatalogGalleryView extends Component<ICatalogState> {
  constructor(
    private readonly events: IEvents,
    items: IProduct[],
  ) {
    super({ items }, ensureElement(".gallery"));
  }

  protected setValues(): void {
    this.container.replaceChildren();

    const cards: HTMLElement[] = this.state.items.map((product) =>
      new CatalogCardView(this.events, product).render(),
    );

    this.container.append(...cards);
  }
}
