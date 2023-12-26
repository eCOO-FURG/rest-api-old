import { Order } from "@/domain/entities/order";
import { OrderProduct } from "@/domain/entities/order-products";
import { OrdersProductsRepository } from "@/domain/repositories/orders-products-repository";

export class InMemoryOrdersProductsRepository
  implements OrdersProductsRepository
{
  items: OrderProduct[] = [];

  async save(orderProduct: OrderProduct): Promise<void> {
    this.items.push(orderProduct);
  }
}
