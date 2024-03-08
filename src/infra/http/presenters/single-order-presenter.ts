import { Order } from "@/domain/entities/order";

export class SingleOrderPresenter {
  static toHttp(orders: Order[]) {
    return orders.map((order) => {
      return {
        id: order.id.value,
        customer_id: order.customer_id.value,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        status: order.status,
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at?.toISOString(),
        items: order.items.map((item) => ({
          product_id: item.product_id.value,
          quantity_or_weight: item.quantity_or_weight,
          price: item.quantity_or_weight.toFixed(2),
        })),
        price: order.price.toFixed(2),
      };
    });
  }
}
