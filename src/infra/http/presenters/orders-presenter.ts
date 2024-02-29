import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Order } from "@/domain/entities/order";

export class OrdersPresenter {
  static toHttp(orders: Order[]) {
    return orders.map((order) => ({
      id: order.id.toString(),
      customer_id: order.customer_id.toString(),
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      status: order.status,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at!.toISOString(),
    }));
  }

  static formatResponse(orders: Order[]) {
    return {
      orders: this.toHttp(orders),
    };
  }
}
