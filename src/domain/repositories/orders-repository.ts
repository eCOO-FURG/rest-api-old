import { Order } from "../entities/order";

export interface OrdersRepository {
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  findByIdWithItems(id: string): Promise<Order | null>;
  findManyByCycleIdAndPage(cycle_id: string, page: number): Promise<Order[]>;
}
