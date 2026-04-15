import { IProduct } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Cart {
  protected items: IProduct[];

  constructor(private readonly events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit(appEvents.CART_CHANGED);
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((cartItem) => cartItem.id !== item.id);
    this.events.emit(appEvents.CART_CHANGED);
  }

  clear(): void {
    this.items = [];
    this.events.emit(appEvents.CART_CLEARED);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
