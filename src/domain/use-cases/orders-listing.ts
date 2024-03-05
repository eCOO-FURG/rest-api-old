import { OrdersRepository } from "../repositories/orders-repository";

interface OrdersListingUseCaseRequest {
  page: number;
}

export class OrdersListingUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ page }: OrdersListingUseCaseRequest) {
    const pageSize = 20;
    const orders = await this.ordersRepository.findManyByDate(page, pageSize);

    return orders;
  }
}
