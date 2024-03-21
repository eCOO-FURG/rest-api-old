import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { ListOrdersUseCase } from "./list-orders";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { Cycle } from "../../entities/cycle";
import { Order } from "../../entities/order";
import { UUID } from "@/core/entities/uuid";
import { makeUser } from "test/factories/make-user";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let sut: ListOrdersUseCase;

describe("list orders", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOffersRepository
    );
    sut = new ListOrdersUseCase(
      inMemoryCyclesRepository,
      inMemoryOrdersRepository
    );
  });

  it("should be able to list orders", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const customer = makeUser();

    const order = Order.create({
      customer,
      cycle_id: cycle.id,
      payment_method: "ON_DELIVERY",
      shipping_address: "fake-address",
    });

    await inMemoryOrdersRepository.save(order);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
    });

    expect(result.orders).toHaveLength(1);
  });
});
