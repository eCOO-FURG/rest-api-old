import { Order } from "../entities/order";

export interface OrdersRepository {
  save(order: Order): Promise<void>;
}
