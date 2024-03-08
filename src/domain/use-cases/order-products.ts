import { ProductsRepository } from "../repositories/products-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { Order } from "../entities/order";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../repositories/offers-repository";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { InsufficientProductQuantityOrWeightError } from "./errors/insufficient-product-quantity-or-weight-error";
import { UUID } from "@/core/entities/uuid";
import { ValidateScheduleUseCase } from "./validate-schedule";

interface OrderProductsUseCaseRequest {
  user_id: string;
  shipping_address: string;
  payment_method: "PIX" | "ON_DELIVERY";
  products: {
    id: string;
    quantity_or_weight: number;
  }[];
}

export class OrderProductsUseCase {
  constructor(
    private validateScheduleCase: ValidateScheduleUseCase,
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    user_id,
    shipping_address,
    payment_method,
    products: orderedProducts,
  }: OrderProductsUseCaseRequest) {
    const schedule = await this.validateScheduleCase.execute({
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

    const lastOfferingDay = schedule.cycle.offering
      .sort((a, b) => a - b)
      .reverse()[0];

    const lastOfferingDate = new Date(
      schedule.start_at.getTime() + (lastOfferingDay - 1) * 24 * 60 * 60 * 1000
    );

    lastOfferingDate.setHours(23, 59, 59, 999);

    const offers =
      await this.offersRepository.findManyItemsByProductIdsAndCreatedAtOlderOrEqualThan(
        orderedProductsIds,
        lastOfferingDate
      );

    const offersByLowestPrice = offers.sort((a, b) => a.price - b.price);

    const order = Order.create({
      customer_id: user.id,
      payment_method,
      shipping_address,
    });

    for (const item of orderedProducts) {
      const product = products.find((product) => product.id.equals(item.id));

      if (!product) {
        throw new ResourceNotFoundError("Produto", item.id);
      }

      if (product.pricing === "WEIGHT" && item.quantity_or_weight % 50 !== 0) {
        throw new InvalidWeightError("solicitado", item.id);
      }

      const offersForItem = offersByLowestPrice.filter((offer) =>
        offer.product_id.equals(item.id)
      );

      let acc = 0;
      for (let index = 0; index < offersForItem.length; index++) {
        const current = offersForItem[index];
        const needed = Math.min(
          item.quantity_or_weight - acc,
          current.quantity_or_weight
        );

        if (!needed) {
          break;
        }

        if (
          index === offersForItem.length - 1 &&
          item.quantity_or_weight > needed + acc
        ) {
          throw new InsufficientProductQuantityOrWeightError(
            product.pricing,
            product.id.value
          );
        }

        current.quantity_or_weight -= needed;
        acc += needed;

        order.add({
          id: new UUID(),
          offer_id: current.offer_id,
          product_id: product.id,
          order_id: order.id,
          quantity_or_weight: needed,
        });

        order.price += needed * current.price;
      }
    }

    await this.ordersRepository.save(order);

    return {
      order,
    };
  }
}
