import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";

interface UpdateOrderStatusUseCaseRequest {
  order_id: string;
  status: "READY" | "ON_HOLD" | "PENDING" | "DISPATCHED" | "CANCELED";
}

export class UpdateOrderStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ order_id, status }: UpdateOrderStatusUseCaseRequest) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new ResourceNotFoundError(order_id);
    }

    order.status = status;

    await this.ordersRepository.update(order!);
  }
}
