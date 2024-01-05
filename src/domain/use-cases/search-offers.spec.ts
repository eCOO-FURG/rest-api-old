import { SearchOffersUseCase } from "./search-offers";
import { FakeNaturalLanguageProcessor } from "test/search/fake-natural-language-processor";
import { CollectionRecord } from "../entities/collection-record";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { Product } from "../entities/product";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { OfferProduct } from "../entities/offer-product";
import { InMemoryProductsCollection } from "test/collections/in-memory-products-collection";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { Offer } from "../entities/offer";

let fakeNaturalLanguageProcessor: FakeNaturalLanguageProcessor;
let inMemoryProductsCollection: InMemoryProductsCollection;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let sut: SearchOffersUseCase;

describe("search offers", () => {
  beforeEach(() => {
    inMemoryProductsCollection = new InMemoryProductsCollection();
    fakeNaturalLanguageProcessor = new FakeNaturalLanguageProcessor();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    sut = new SearchOffersUseCase(
      fakeNaturalLanguageProcessor,
      inMemoryProductsCollection,
      inMemoryProductsRepository,
      inMemoryOffersProductsRepository
    );
  });

  it("should be able to search offers by sematinc similarity", async () => {
    const products = ["Apple", "Potato", "Strawberry"];

    await Promise.all(
      products.map(async (name, index) => {
        await inMemoryProductsCollection.save(
          CollectionRecord.create(
            {
              embeeding: await fakeNaturalLanguageProcessor.embed(name),
              payload: { name },
            },
            new UniqueEntityID(index.toString())
          )
        );
        await inMemoryProductsRepository.save(
          Product.create(
            {
              name,
              type_id: new UniqueEntityID("1"),
            },
            new UniqueEntityID(index.toString())
          )
        );
      })
    );

    await inMemoryOffersRepository.save(
      Offer.create(
        {
          agribusiness_id: new UniqueEntityID("1"),
          status: "AVAILABLE",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryOffersRepository.save(
      Offer.create(
        {
          agribusiness_id: new UniqueEntityID("1"),
          status: "AVAILABLE",
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        offer_id: new UniqueEntityID("1"),
        product_id: new UniqueEntityID("1"),
        price: "1",
        quantity: 1,
        weight: "1",
      })
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        offer_id: new UniqueEntityID("2"),
        product_id: new UniqueEntityID("1"),
        price: "1",
        quantity: 1,
        weight: "1",
      })
    );

    const result = await sut.execute({ product: "Potato" });

    expect(result[0].offers).toHaveLength(2);
  });
});
