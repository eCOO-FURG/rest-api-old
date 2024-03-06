import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";

interface OrderListingUseCaseRequest {
  order_id: string;
}

export class OrderListingUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ order_id }: OrderListingUseCaseRequest) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new ResourceNotFoundError("Pedido", order_id);
    }

    return order;
  }
}
