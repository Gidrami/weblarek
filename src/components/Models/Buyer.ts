import { IBuyer, PartialBuyer, TPayment } from "../../types";
import { events as appEvents } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor(protected events: IEvents) {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  setData(values: Partial<IBuyer>): void {
    if (values.payment !== undefined) {
      this.payment = values.payment;
    }

    if (values.email !== undefined) {
      this.email = values.email;
    }

    if (values.phone !== undefined) {
      this.phone = values.phone;
    }

    if (values.address !== undefined) {
      this.address = values.address;
    }

    this.events.emit(appEvents.BUYER_CHANGED);
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    
    this.events.emit(appEvents.BUYER_CHANGED);
  }

  validate(): PartialBuyer {
    const errors: PartialBuyer = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    }

    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
