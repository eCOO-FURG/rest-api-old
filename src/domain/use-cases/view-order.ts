import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";
import { OffersRepository } from "../repositories/offers-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface ViewOrderUseCaseRequest {
  order_id: string;
}

export class ViewOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private offersRepository: OffersRepository,
    private agribusinessRepository: AgribusinessesRepository
  ) {}

  async execute({ order_id }: ViewOrderUseCaseRequest) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new ResourceNotFoundError("Pedido", order_id);
    }

    const offersIds = order.items.map((item) => item.offer_id.value);
    const productsIds = order.items.map((item) => item.product.id.value);

    const offers =
      await this.offersRepository.findManyByOffersIdsAndProductsIds(
        offersIds,
        productsIds
      );

    const agribusinessIds = offers.map((item) => item.agribusiness_id.value);

    const agribusinesses = await this.agribusinessRepository.findManyByIds(
      agribusinessIds
    );

    return {
      order,
      offers,
      agribusinesses,
    };
  }
}
