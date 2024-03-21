import { Order } from "@/domain/entities/order";

export class OrdersPresenter {
  static toHttp(orders: Order[]) {
    return orders.map((order) => ({
      id: order.id.value,
      payment_method: order.payment_method,
      shipping_address:
        order.payment_method === "ON_DELIVERY" ? null : order.shipping_address,
      status: order.status,
      price: order.price,
      customer: {
        id: order.customer.id.value,
        first_name: order.customer.first_name,
        last_name: order.customer.last_name,
      },
    }));
  }
}
