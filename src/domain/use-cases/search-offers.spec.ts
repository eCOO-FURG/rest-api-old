import { SearchOffersUseCase } from "./search-offers";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { FakeNaturalLanguageProcessor } from "test/search/fake-natural-language-processor";
import { Product } from "../entities/product";
import { Offer } from "../entities/offer";
import { UUID } from "@/core/entities/uuid";
import { Record } from "../entities/record";
import { Cycle } from "../entities/cycle";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { ValidateCycleUseCase } from "./validate-cycle";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let validateCycleUseCase: ValidateCycleUseCase;
let fakeNaturalLanguageProcessor: FakeNaturalLanguageProcessor;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let sut: SearchOffersUseCase;

describe("search offers", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    validateCycleUseCase = new ValidateCycleUseCase(inMemoryCyclesRepository);
    fakeNaturalLanguageProcessor = new FakeNaturalLanguageProcessor();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    sut = new SearchOffersUseCase(
      validateCycleUseCase,
      fakeNaturalLanguageProcessor,
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

    await inMemoryProductsRepository.save(product2);

    const record1 = Record.create({
      name: product1.name,
    });

    await fakeNaturalLanguageProcessor.save(record1);

    const record2 = Record.create({
      name: product2.name,
    });

    await fakeNaturalLanguageProcessor.save(record2);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
    });

    const offerProduct1 = {
      id: new UUID(),
      offer_id: offer.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    };

    const offerProduct2 = {
      id: new UUID(),
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 10,
    };

    offer.add(offerProduct1);
    offer.add(offerProduct2);

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      product: "banana",
    });

    expect(result.offersItems).toHaveLength(1);
  });
});
