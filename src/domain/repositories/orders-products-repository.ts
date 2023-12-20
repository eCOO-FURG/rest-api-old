import { OrderProduct } from "../entities/order-products";

export interface OrdersProductsRepository {
  save(orderProduct: OrderProduct): Promise<void>;
}
