import { SearchOffersUseCase } from "./search-offers";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { FakeNaturalLanguageProcessor } from "test/search/fake-natural-language-processor";
import { Product } from "../entities/product";
import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";
import { UUID } from "@/core/entities/uuid";
import { Record } from "../entities/record";

let fakeNaturalLanguageProcessor: FakeNaturalLanguageProcessor;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let sut: SearchOffersUseCase;

describe("search offers", () => {
  beforeEach(() => {
    fakeNaturalLanguageProcessor = new FakeNaturalLanguageProcessor();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    sut = new SearchOffersUseCase(
      fakeNaturalLanguageProcessor,
      inMemoryProductsRepository,
      inMemoryOffersRepository
    );
  });

  it("should be able to search offers by sematinc similarity", async () => {
    const product1 = Product.create({
      image: "image",
      name: "banana",
      pricing: "WEIGHT",
      type_id: "fake-id",
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      image: "image",
      name: "apple",
      pricing: "UNIT",
      type_id: "fake-id",
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
      agribusiness_id: new UUID("fake-id"),
    });

    const offerProduct1 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct2 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 10,
    });

    offer.add(offerProduct1);
    offer.add(offerProduct2);
    offer.add(offerProduct3);

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      product: "banana",
    });

    expect(result.offersItems).toHaveLength(2);
  });
});
