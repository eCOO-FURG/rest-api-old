import { Order } from "../entities/order";

export interface OrdersRepository {
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  findByIdWithItems(id: string): Promise<Order | null>;
  findManyByCycleIdPageAndStatus(
    cycle_id: string,
    page: number,
    status: Order["status"]
  ): Promise<Order[]>;
}
