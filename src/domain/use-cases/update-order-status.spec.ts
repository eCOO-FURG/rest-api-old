import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UpdateOrderStatusUseCase } from "./update-order-status";
import { InMemoryOrdersProductsRepository } from "test/repositories/in-memory-orders-products-repository";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";
import { Order } from "../entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryOrdersProductsRepository: InMemoryOrdersProductsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let sut: UpdateOrderStatusUseCase;
describe("update order status", () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryOrdersProductsRepository = new InMemoryOrdersProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    sut = new UpdateOrderStatusUseCase(inMemoryOrdersRepository);
  });

  it("should be able to update a status of an order to DISPATCHED", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("519876543"),
    });

    const order = Order.create({
      customer_id: account.id,
      payment_method: "PIX",
      shipping_address: "test address",
    });

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      order_id: order.id.toString(),
      status: "DISPATCHED",
    });

    expect("DISPATCHED").toContain(inMemoryOrdersRepository.items[0].status);
  });

  it("should throw ResourceNotFoundError when updating the status of a non-existent order", async () => {
    const invalid_id = "123";

    await expect(() =>
      sut.execute({
        order_id: invalid_id,
        status: "ON_HOLD",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
