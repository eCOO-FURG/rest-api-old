import { OrdersRepository } from "../repositories/orders-repository";

interface ListOfOrdersUseCaseRequest {
  order_status: string;
}

export class ListOfOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ order_status }: ListOfOrdersUseCaseRequest) {
    const orders = await this.ordersRepository.findByStatus(order_status);

    return orders;
  }
}
