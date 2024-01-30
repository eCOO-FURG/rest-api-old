import { InMemoryOrdersProductsRepository } from "test/repositories/in-memory-orders-products-repository";
import { Account } from "../entities/account";
import { Order } from "../entities/order";
import { HandleOrderUseCase } from "./handle-order";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { OrderProduct } from "../entities/order-products";

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrdersProductsRepository: InMemoryOrdersProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let sut: HandleOrderUseCase;
describe("handle offer", () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryOrdersProductsRepository = new InMemoryOrdersProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    sut = new HandleOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryOrdersProductsRepository,
      inMemoryOffersProductsRepository
    );
  });

  it("should be able to approve a offer when a payment is received", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
    });

    const order = Order.create({
      customer_id: account.id,
      payment_method: "PIX",
      shipping_address: "test address",
    });

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      order_id: order.id.toString(),
      event: "PAYMENT_RECEIVED",
    });

    expect(["READY", "ON_HOLD"]).toContain(
      inMemoryOrdersRepository.items[0].status
    );
  });

  it("should be able to rollback a offer when a payment is overdue", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
    });

    const offerProduct1 = OfferProduct.create({
      offer_id: new UniqueEntityID("1"),
      price: 10.0,
      product_id: new UniqueEntityID("1"),
      quantity: 4,
      weight: "10",
    });

    const offerProduct2 = OfferProduct.create({
      offer_id: new UniqueEntityID("1"),
      price: 10.0,
      product_id: new UniqueEntityID("2"),
      quantity: 6,
      weight: "10",
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: new UniqueEntityID("2"),
      price: 10.0,
      product_id: new UniqueEntityID("1"),
      quantity: 4,
      weight: "10",
    });

    const offerProduct4 = OfferProduct.create({
      offer_id: new UniqueEntityID("3"),
      price: 10.0,
      product_id: new UniqueEntityID("4"),
      quantity: 20,
      weight: "10",
    });

    await inMemoryOffersProductsRepository.save([
      offerProduct1,
      offerProduct2,
      offerProduct3,
      offerProduct4,
    ]);

    const order = Order.create({
      customer_id: account.id,
      payment_method: "PIX",
      shipping_address: "test address",
    });

    await inMemoryOrdersRepository.save(order);

    await inMemoryOrdersProductsRepository.save([
      OrderProduct.create({
        offer_product_id: offerProduct1.id,
        order_id: order.id,
        product_id: new UniqueEntityID("1"),
        quantity: 6,
      }),
      OrderProduct.create({
        offer_product_id: offerProduct2.id,
        order_id: order.id,
        product_id: new UniqueEntityID("2"),
        quantity: 4,
      }),
      OrderProduct.create({
        offer_product_id: offerProduct3.id,
        order_id: order.id,
        product_id: new UniqueEntityID("1"),
        quantity: 6,
      }),
      OrderProduct.create({
        offer_product_id: offerProduct4.id,
        order_id: order.id,
        product_id: new UniqueEntityID("4"),
        quantity: 6,
      }),
    ]);

    await sut.execute({
      order_id: order.id.toString(),
      event: "PAYMENT_OVERDUE",
    });

    expect(inMemoryOrdersRepository.items[0].status).toBe("CANCELED");
    expect(inMemoryOffersProductsRepository.items[0].quantity).toBe(10);
    expect(inMemoryOffersProductsRepository.items[1].quantity).toBe(10);
    expect(inMemoryOffersProductsRepository.items[2].quantity).toBe(10);
    expect(inMemoryOffersProductsRepository.items[3].quantity).toBe(26);
  });
});
