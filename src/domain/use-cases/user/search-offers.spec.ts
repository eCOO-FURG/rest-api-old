import { SearchOffersUseCase } from "./search-offers";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { Product } from "../../entities/product";
import { Offer } from "../../entities/offer";
import { UUID } from "@/core/entities/uuid";
import { Cycle } from "../../entities/cycle";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { ValidateCycleActionUseCase } from "../market/validate-cycle-action";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { Agribusiness } from "@/domain/entities/agribusiness";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let validateCycleUseCase: ValidateCycleActionUseCase;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryAgribusinessRepository: InMemoryAgribusinessesRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: SearchOffersUseCase;

describe("search offers", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    validateCycleUseCase = new ValidateCycleActionUseCase(
      inMemoryCyclesRepository
    );
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAgribusinessRepository = new InMemoryAgribusinessesRepository(
      inMemoryUsersRepository
    );
    inMemoryOffersRepository = new InMemoryOffersRepository(
      inMemoryAgribusinessRepository
    );
    sut = new SearchOffersUseCase(
      validateCycleUseCase,
      inMemoryOffersRepository
    );
  });

  it("should be able search offers with their agribusinesses", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const agribusiness = Agribusiness.create({
      name: "Agronegócio de Teste",
      admin_id: new UUID(),
      caf: "123123",
      active: true,
    });

    inMemoryAgribusinessRepository.save(agribusiness);

    const product = Product.create({
      image: "image",
      name: "banana",
      pricing: "WEIGHT",
      type_id: new UUID("fake-id"),
    });

    inMemoryProductsRepository.save(product);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: agribusiness.id,
      created_at: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
    });

    offer.add({
      product,
      amount: 50,
      price: 10.0,
    });

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      product: "banana",
      page: 1,
    });

    expect(result.offersWithAgribusiness).toHaveLength(1);
  });
});
