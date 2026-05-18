import { IProduct } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Products {
  protected items: IProduct[];
  protected selectedItem: IProduct | null;

  constructor(protected events: IEvents){
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;

    this.events.emit(appEvents.PRODUCTS_CHANGED);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;

    this.events.emit(appEvents.PRODUCT_SELECTED, item);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
