import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrdersRepository } from "../../repositories/orders-repository";
import { InvalidOrderStatusError } from "../errors/invalid-order-status-error";
import { Order } from "../../entities/order";

interface UpdateOrderStatusUseCaseRequest {
  order_id: string;
  status: Order["status"];
}

export class UpdateOrderStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ order_id, status }: UpdateOrderStatusUseCaseRequest) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new ResourceNotFoundError("Pedido", order_id);
    }

    if (status === order.status) {
      return;
    }

    if (order.status === "CANCELED") {
      throw new InvalidOrderStatusError();
    }

    order.status = status;

    await this.ordersRepository.update(order);
  }
}
