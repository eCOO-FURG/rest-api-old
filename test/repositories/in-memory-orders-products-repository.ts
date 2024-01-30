import { OrderProduct } from "@/domain/entities/order-products";
import { OrdersProductsRepository } from "@/domain/repositories/orders-products-repository";

export class InMemoryOrdersProductsRepository
  implements OrdersProductsRepository
{
  items: OrderProduct[] = [];

  async save(orderProducts: OrderProduct[]): Promise<void> {
    this.items.push(...orderProducts);
  }

  async findManyByOrderId(order_id: string): Promise<OrderProduct[]> {
    const orderProducts = this.items.filter(
      (item) => item.order_id.toString() === order_id
    );

    return orderProducts;
  }
}
