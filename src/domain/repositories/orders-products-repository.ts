import { OrderProduct } from "../entities/order-products";

export interface OrdersProductsRepository {
  save(items: OrderProduct[]): Promise<void>;
  findManyByOrderId(order_id: string): Promise<OrderProduct[]>;
}
