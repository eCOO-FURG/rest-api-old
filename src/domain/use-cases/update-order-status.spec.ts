import { UUID } from "@/core/entities/uuid";
import { Order } from "../entities/order";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { UpdateOrderStatusUseCase } from "./update-order-status";
import { Offer } from "../entities/offer";
import { Product } from "../entities/product";
import { InvalidOrderStatusError } from "./errors/invalid-order-status-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: UpdateOrderStatusUseCase;

describe("update order status", () => {
  beforeEach(() => {
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOffersRepository
    );
    sut = new UpdateOrderStatusUseCase(inMemoryOrdersRepository);
  });

  it("should be able to update the status of an order", async () => {
    const order = Order.create({
      customer_id: new UUID("fake-id"),
      cycle_id: new UUID("fake-id"),
      payment_method: "ON_DELIVERY",
      shipping_address: "fake-id",
      status: "PENDING",
    });

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      order_id: order.id.value,
      status: "READY",
    });

    expect(inMemoryOrdersRepository.items[0].status).toBe("READY");
  });

  it("should not be able to update the status of and canceled order", async () => {
    const order = Order.create({
      customer_id: new UUID("fake-id"),
      cycle_id: new UUID("fake-id"),
      payment_method: "ON_DELIVERY",
      shipping_address: "fake-id",
      status: "CANCELED",
    });

    await inMemoryOrdersRepository.save(order);

    await expect(
      sut.execute({
        order_id: order.id.value,
        status: "PAID",
      })
    ).rejects.toBeInstanceOf(InvalidOrderStatusError);
  });

  it("should not be able to update the status that do not exists", async () => {
    await expect(
      sut.execute({
        order_id: "fake-id",
        status: "PAID",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to return the order produts to its offers when canceling an order", async () => {
    const offer = Offer.create({
      agribusiness_id: new UUID("fake-id"),
      cycle_id: new UUID("fake-id"),
    });

    const product = Product.create({
      image: "fake-image",
      name: "fake-image",
      pricing: "UNIT",
      type_id: new UUID("fake-id"),
    });

    offer.add({
      product,
      price: 10,
      amount: 0,
    });

    await inMemoryOffersRepository.save(offer);

    const order = Order.create({
      customer_id: new UUID("fake-id"),
      cycle_id: new UUID("fake-id"),
      payment_method: "ON_DELIVERY",
      shipping_address: "fake-id",
      status: "PENDING",
    });

    order.add({
      offer_id: offer.id,
      product,
      amount: 10,
    });

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      order_id: order.id.value,
      status: "CANCELED",
    });

    expect(inMemoryOrdersRepository.items[0].status).toBe("CANCELED");
    expect(inMemoryOffersRepository.items[0].items[0].amount).toBe(10);
  });
});
