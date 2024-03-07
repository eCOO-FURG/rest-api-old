import { ProductsRepository } from "../repositories/products-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { Order } from "../entities/order";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../repositories/offers-repository";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { InsufficientProductQuantityOrWeightError } from "./errors/insufficient-product-quantity-or-weight-error";

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
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const orderedProductsIds = orderedProducts.map((product) => product.id);

    const products = await this.productsRepository.findManyByIds(
      orderedProductsIds
    );

    const offers = await this.offersRepository.findManyItemsByProductIds(
      orderedProductsIds
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
