import { Order } from "../entities/order";

export interface OrdersRepository {
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByStatus(status: string): Promise<Order[]>;
}
