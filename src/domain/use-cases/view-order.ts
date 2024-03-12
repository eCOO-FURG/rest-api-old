import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";
import { UsersRepository } from "../repositories/users-repository";
import { OffersRepository } from "../repositories/offers-repository";
import { ProductsRepository } from "../repositories/products-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface ViewOrderUseCaseRequest {
  order_id: string;
}

export class ViewOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
    private offersRepository: OffersRepository,
    private productsRepository: ProductsRepository,
    private agribusinessRepository: AgribusinessesRepository
  ) {}

  async execute({ order_id }: ViewOrderUseCaseRequest) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new ResourceNotFoundError("Pedido", order_id);
    }

    const user = await this.usersRepository.findById(order.customer_id.value);

    if (!user) {
      throw new ResourceNotFoundError("Cliente", order.customer_id.value);
    }

    const offersIds = order.items.map((item) => item.offer_id.value);
    const productsIds = order.items.map((item) => item.product_id.value);

    const offers =
      await this.offersRepository.findManyByOffersIdsAndProductsIds(
        offersIds,
        productsIds
      );

    const products = await this.productsRepository.findManyByIds(productsIds);

    const agribusinessIds = offers.map((item) => item.agribusiness_id.value);

    const agribusinesses = await this.agribusinessRepository.findManyByIds(
      agribusinessIds
    );

    return {
      user,
      order,
      offers,
      products,
      agribusinesses,
    };
  }
}
