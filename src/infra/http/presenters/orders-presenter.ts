import { Order } from "@/domain/entities/order";

export class OrderPresenter {
  static toHttp(orders: Order[]) {
    const data = orders.map((order) => ({
      payment_method: order.payment_method,
      shipping_address:
        order.payment_method === "ON_DELIVERY" ? null : order.shipping_address,
      status: order.status,
      price: order.price,
    }));

    return {
      data,
    };
  }
}
