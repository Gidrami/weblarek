import { ICatalogViewModel, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CatalogCardView } from "./CatalogCardView";

export class CatalogGalleryView extends Component<ICatalogViewModel> {


  constructor(
    private readonly events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
  }

  set elements(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
