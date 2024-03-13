import { Order } from "@/domain/entities/order";

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.value,
      payment_method: order.payment_method,
      shipping_address:
        order.payment_method === "ON_DELIVERY" ? null : order.shipping_address,
      status: order.status,
      price: order.price,
    };
  }
}
