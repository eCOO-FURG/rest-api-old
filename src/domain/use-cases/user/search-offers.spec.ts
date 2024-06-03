import { SearchOffersUseCase } from "./search-offers";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { Product } from "../../entities/product";
import { Offer } from "../../entities/offer";
import { UUID } from "@/core/entities/uuid";
import { Cycle } from "../../entities/cycle";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { ValidateCycleActionUseCase } from "../market/validate-cycle-action";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let validateCycleUseCase: ValidateCycleActionUseCase;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let sut: SearchOffersUseCase;

describe("search offers", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    validateCycleUseCase = new ValidateCycleActionUseCase(
      inMemoryCyclesRepository
    );
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    sut = new SearchOffersUseCase(
      validateCycleUseCase,
      inMemoryProductsRepository,
      inMemoryOffersRepository
    );
  });

  it("should be able to search offers by sematinc similarity that were offered before the last offering instant of the active cycle", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const product1 = Product.create({
      image: "image",
      name: "banana",
      pricing: "WEIGHT",
      type_id: new UUID("fake-id"),
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      image: "image",
      name: "apple",
      pricing: "UNIT",
      type_id: new UUID("fake-id"),
    });

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
      created_at: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
    });

    offer.add({
      product: product1,
      amount: 50,
      price: 10.0,
    });

    offer.add({
      product: product2,
      amount: 10,
      price: 10.0,
    });

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      product: "banana",
      page: 1,
    });

    expect(result.items).toHaveLength(1);
  });
});
