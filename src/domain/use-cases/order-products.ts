import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrdersProductsRepository } from "../repositories/orders-products-repository";
import { PaymentsProcessor } from "../payments/payments-processor";
import { AccountsRepository } from "../repositories/accounts-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InsufficientProductQuantityError } from "./errors/insufficient-product-quantity-error";
import { Order } from "../entities/order";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { OrderProduct } from "../entities/order-products";
import { Charge } from "../entities/charge";

interface OrderProductsUseCaseRequest {
  account_id: string;
  products: {
    id: string;
    quantity: number;
  }[];
}

export class OrderProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository,
    private ordersRepository: OrdersRepository,
    private ordersProductsRepository: OrdersProductsRepository,
    private paymentsProcessor: PaymentsProcessor,
    private accountsRepository: AccountsRepository
  ) {}

  async execute({
    account_id,
    products: orderedProducts,
  }: OrderProductsUseCaseRequest) {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const orderedProductsIds = orderedProducts.map((product) => product.id);

    const products = await this.productsRepository.findManyByIds(
      orderedProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    for (const orderedProduct of orderedProducts) {
      if (!productsIds.includes(orderedProduct.id)) {
        throw new ResourceNotFoundError(orderedProduct.id);
      }
    }

    const offers =
      await this.offersProductsRepository.findManyByProductsIdsAndStatus(
        productsIds,
        "AVAILABLE"
      );

    for (const orderedProduct of orderedProducts) {
      const offersForProduct = offers.filter((offerProduct) => {
        return offerProduct.product_id.toString() === orderedProduct.id;
      });

      const availableQuantityForProduct = offersForProduct.reduce(
        (total, product) => total + product.quantity,
        0
      );

      if (orderedProduct.quantity > availableQuantityForProduct) {
        throw new InsufficientProductQuantityError(orderedProduct.id);
      }
    }

    const offersByLowestPrice = offers.sort((a, b) => a.price - b.price);

    const updatedProductsOffers: OfferProduct[] = [];

    const order = Order.create({
      customer_id: new UniqueEntityID(account_id),
      payment_method: "PIX",
      shipping_address: "Av. José de Souza Castro - 147",
    });

    const orderProducts: OrderProduct[] = [];
    let totalValue = 0;

    for (const orderedProduct of orderedProducts) {
      const productOffersByLowestPrice = offersByLowestPrice.filter(
        (offer) => offer.product_id.toString() === orderedProduct.id
      );

      const orderedQuantity = orderedProduct.quantity;

      productOffersByLowestPrice.reduce((selectedQuantity, offer, index) => {
        if (selectedQuantity === orderedQuantity) {
          productOffersByLowestPrice.slice(0, index);
        }

        const orderProduct = OrderProduct.create({
          offer_product_id: offer.id,
          order_id: order.id,
          product_id: new UniqueEntityID(orderedProduct.id),
          quantity: 0,
        });

        const quantityNeeded = Math.min(
          orderedQuantity - selectedQuantity,
          offer.quantity
        );

        totalValue += quantityNeeded * offer.price;

        orderProduct.quantity = quantityNeeded;
        orderProducts.push(orderProduct);

        selectedQuantity += quantityNeeded;
        offer.quantity -= quantityNeeded;

        return selectedQuantity;
      }, 0);

      updatedProductsOffers.push(...productOffersByLowestPrice);
    }

    console.log(order.id);

    await Promise.all([
      this.offersProductsRepository.update(updatedProductsOffers),
      this.ordersRepository.save(order),
    ]);
    await this.ordersProductsRepository.save(orderProducts);

    const charge = Charge.create({
      customer_email: account.email,
      order_id: order.id,
      payment_method: "PIX",
      value: totalValue.toString(), // eventually add plataform taxes
      due_date: new Date(),
    });

    const payment = await this.paymentsProcessor.registerCharge(charge);

    return payment;
  }
}
