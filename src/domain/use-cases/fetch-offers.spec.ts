import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products";
import { FetchOffersUseCase } from "./fetch-offers";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { Product } from "../entities/product";
import { OfferProduct } from "../entities/offer-product";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let sut: FetchOffersUseCase;

describe("fetch offers", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository();
    sut = new FetchOffersUseCase(
      inMemoryProductsRepository,
      inMemoryOffersProductsRepository
    );
  });

  it("should be able to fetch offers by product name", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "apple",
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        offer_id: new UniqueEntityID("1"),
        product_id: new UniqueEntityID("1"),
        amount: "1",
        quantity: "1",
        weight: "1",
      })
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        offer_id: new UniqueEntityID("2"),
        product_id: new UniqueEntityID("2"),
        amount: "1",
        quantity: "1",
        weight: "1",
      })
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        offer_id: new UniqueEntityID("3"),
        product_id: new UniqueEntityID("2"),
        amount: "1",
        quantity: "1",
        weight: "1",
      })
    );

    const result = await sut.execute({
      name: "",
    });

    expect(result).toBeInstanceOf<OfferProduct[][]>;
  });
});
