import { Order } from "@prisma/client";

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      ...order,
    };
  }
}
