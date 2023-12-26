import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InsufficientOffers } from "./errors/insufficient-offers";
import { Order } from "../entities/order";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderProduct } from "../entities/order-products";
import { OrdersProductsRepository } from "../repositories/orders-products-repository";
import { DomainEvents } from "@/core/events/domain-events";

interface OrderProductsUseCaseRequest {
  account_id: string;
  order: {
    product_id: string;
    quantity: number;
  }[];
}

export class OrderProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository,
    private ordersRepository: OrdersRepository,
    private ordersProductsRepository: OrdersProductsRepository
  ) {}

  async execute({
    account_id,
    order: orderedItens,
  }: OrderProductsUseCaseRequest) {
    const productsIds = [
      ...new Set(orderedItens.map((product) => product.product_id)),
    ];

    await Promise.all(
      productsIds.map(async (id) => {
        const product = await this.productsRepository.findById(id);

        if (!product) {
          throw new ResourceNotFoundError(id);
        }
      })
    );

    const offers = await this.offersProductsRepository.findManyByProductsIds(
      productsIds
    );

    const offersByProduct: { product_id: string; quantity: number }[] =
      offers.reduce((acc, offer) => {
        const productIndex = acc.findIndex(
          (item) => item.product_id === offer.product_id.toString()
        );

        if (productIndex !== -1) {
          acc[productIndex].quantity += parseInt(offer.quantity);
        } else {
          acc.push({
            product_id: offer.product_id.toString(),
            quantity: parseInt(offer.quantity),
          });
        }

        return acc;
      }, [] as { product_id: string; quantity: number }[]);

    orderedItens.forEach((orderedProduct) => {
      const offerIndex = offersByProduct.findIndex(
        (offer) => offer.product_id === orderedProduct.product_id
      );

      const offerAvailableQuantity = offersByProduct[offerIndex].quantity;

      if (orderedProduct.quantity > offerAvailableQuantity) {
        throw new InsufficientOffers(offersByProduct[offerIndex].product_id);
      }
    });

    const order = Order.create({
      customer_id: new UniqueEntityID(account_id),
      payment_method: "PIX",
      shipping_address: "test-address",
    });

    await this.ordersRepository.save(order);

    orderedItens.forEach(async ({ product_id, quantity }) => {
      const orderProduct = OrderProduct.create({
        order_id: order.id,
        product_id: new UniqueEntityID(product_id),
        quantity,
      });

      await this.ordersProductsRepository.save(orderProduct);
    });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }
}
