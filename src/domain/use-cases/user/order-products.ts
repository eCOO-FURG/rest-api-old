import { ProductsRepository } from "../../repositories/products-repository";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order } from "../../entities/order";
import { UsersRepository } from "../../repositories/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../../repositories/offers-repository";
import { InsufficientProductQuantityOrWeightError } from "../errors/insufficient-product-quantity-or-weight-error";
import { farthestDayBetween } from "../utils/fhartest-day-between";
import { ValidateCycleActionUseCase } from "../market/validate-cycle-action";

interface OrderProductsUseCaseRequest {
  user_id: string;
  cycle_id: string;
  shipping_address: string;
  payment_method: Order["payment_method"];
  products: {
    id: string;
    amount: number;
  }[];
}

export class OrderProductsUseCase {
  constructor(
    private validadeCycleActionUseCase: ValidateCycleActionUseCase,
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    user_id,
    cycle_id,
    shipping_address,
    payment_method,
    products: orderedProducts,
  }: OrderProductsUseCaseRequest) {
    const { cycle } = await this.validadeCycleActionUseCase.execute({
      cycle_id,
      action: "ordering",
    });

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const orderedProductsIds = orderedProducts.map((product) => product.id);

    const products = await this.productsRepository.findManyByIds(
      orderedProductsIds
    );

    const firstOfferingDay = farthestDayBetween(cycle.offering);

    const offers =
      await this.offersRepository.findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
        cycle.id.value,
        orderedProductsIds,
        firstOfferingDay
      );

    const offersByLowestPrice = offers.sort((a, b) => a.price - b.price);

    const order = Order.create({
      customer: user,
      cycle_id: cycle.id,
      payment_method,
      shipping_address,
    });

    for (const item of orderedProducts) {
      const product = products.find((product) => product.id.equals(item.id));

      if (!product) {
        throw new ResourceNotFoundError("Produto", item.id);
      }

      const offersForItem = offersByLowestPrice.filter((offer) =>
        offer.product.id.equals(item.id)
      );

      if (offersForItem.length === 0) {
        throw new InsufficientProductQuantityOrWeightError(
          product.pricing,
          product.id.value
        );
      }

      let acc = 0;

      for (let index = 0; index < offersForItem.length; index++) {
        const current = offersForItem[index];
        const needed = Math.min(item.amount - acc, current.amount);

        if (!needed) {
          break;
        }

        if (index === offersForItem.length - 1 && item.amount > needed + acc) {
          throw new InsufficientProductQuantityOrWeightError(
            product.pricing,
            product.id.value
          );
        }

        current.amount -= needed;
        acc += needed;

        order.add({
          product,
          offer_id: current.offer_id,
          amount: needed,
        });

        if (current.product.pricing === "UNIT") {
          order.price += needed * current.price;
        } else {
          order.price += (needed / 50) * current.price;
        }
      }
    }

    order.tax(20);

    await this.ordersRepository.save(order);

    return {
      order,
    };
  }
}
