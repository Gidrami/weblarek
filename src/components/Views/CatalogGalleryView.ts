import { ICatalogViewModel } from "../../types"
import { Component } from "../base/Component"

export class CatalogGalleryView extends Component<ICatalogViewModel> {
  constructor(
    container: HTMLElement,
  ) {
    super(container);
  }

  set elements(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
