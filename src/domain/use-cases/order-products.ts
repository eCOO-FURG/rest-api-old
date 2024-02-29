import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrdersProductsRepository } from "../repositories/orders-products-repository";
import { PaymentsProcessor } from "../payments/payments-processor";
import { AccountsRepository } from "../repositories/accounts-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Order } from "../entities/order";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { OrderProduct } from "../entities/order-products";
import { Charge } from "../entities/charge";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { InsufficientProductQuantityOrWeightError } from "./errors/insufficient-product-quantity-or-weight-error";
import { Payment } from "../entities/payment";

interface OrderProductsUseCaseRequest {
  account_id: string;
  shipping_address: string;
  payment_method: "PIX" | "ON_DELIVERY";
  products: {
    id: string;
    quantity_or_weight: number;
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
    shipping_address,
    payment_method,
    products: orderedProducts,
  }: OrderProductsUseCaseRequest) {
    const orderedProductsIds = orderedProducts.map((item) => item.id);

    const products = await this.productsRepository.findManyByIds(
      orderedProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    const offersProducts =
      await this.offersProductsRepository.findManyWithRemainingQuantityOrWeightByProductsIdsAndStatus(
        productsIds,
        "AVAILABLE"
      );

    const order = Order.create({
      customer_id: new UniqueEntityID(account_id),
      payment_method,
      shipping_address,
    });

    let totalPrice = 0;
    const orderProducts: OrderProduct[] = [];
    const updatedOffersProducts: OfferProduct[] = [];

    for (const item of orderedProducts) {
      const itemExists = productsIds.includes(item.id);

      if (!itemExists) {
        throw new ResourceNotFoundError(item.id);
      }

      const offersForItem = offersProducts.filter((offerProduct) =>
        offerProduct.product_id.equals(new UniqueEntityID(item.id))
      );

      const product = products.find((product) =>
        product.id.equals(new UniqueEntityID(item.id))
      )!;

      if (product.pricing === "WEIGHT" && item.quantity_or_weight % 50 !== 0) {
        throw new InvalidWeightError("ordered", item.id);
      }

      const available = offersForItem.reduce(
        (total, product) => total + product.quantity_or_weight,
        0
      );

      if (item.quantity_or_weight > available) {
        throw new InsufficientProductQuantityOrWeightError(
          product.pricing === "UNIT" ? "quantity" : "weight",
          item.id
        );
      }

      const offersByLowestPrice = offersForItem.sort(
        (a, b) => a.price - b.price
      );

      offersByLowestPrice.reduce((selected, offerProduct, index) => {
        if (selected === item.quantity_or_weight) {
          offersByLowestPrice.slice(0, index);
        }

        const orderProduct = OrderProduct.create({
          offer_product_id: offerProduct.id,
          order_id: order.id,
          product_id: product.id,
          quantity_or_weight: 0,
        });

        const needed = Math.min(
          item.quantity_or_weight - selected,
          offerProduct.quantity_or_weight
        );

        totalPrice += needed * offerProduct.price;

        orderProduct.quantity_or_weight = needed;
        orderProducts.push(orderProduct);

        selected += needed;
        offerProduct.quantity_or_weight -= needed;

        return selected;
      }, 0);

      updatedOffersProducts.push(...offersByLowestPrice);
    }

    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const payment = Payment.create({
      value: totalPrice.toString(),
    });

    if (payment_method === "PIX") {
      const charge = Charge.create({
        customer_email: account.email,
        due_date: new Date(),
        order_id: order.id,
        payment_method,
        value: totalPrice.toString(),
      });

      const props = await this.paymentsProcessor.registerCharge(charge);

      Object.assign(payment, {
        ...props,
      });
    }

    await this.offersProductsRepository.update(updatedOffersProducts);
    await this.ordersRepository.save(order);
    await this.ordersProductsRepository.save(orderProducts);

    return payment;
  }
}
