import { OfferProductsUseCase } from "./offer-products";
import { Agribusiness } from "../entities/agribusiness";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { Offer } from "../entities/offer";
import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products";
import { Product } from "../entities/product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryAgribusinessesRepostory: InMemoryAgribusinessesRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: OfferProductsUseCase;

describe("offer product", () => {
  beforeEach(() => {
    inMemoryAgribusinessesRepostory = new InMemoryAgribusinessesRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();

    sut = new OfferProductsUseCase(
      inMemoryOffersRepository,
      inMemoryOffersProductsRepository,
      inMemoryProductsRepository
    );
  });

  it("should be able to offer products", async () => {
    const agribussines = Agribusiness.create({
      admin_id: new UniqueEntityID("fake-id"),
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepostory.save(agribussines);

    const product = Product.create({
      name: "potato",
    });

    await inMemoryProductsRepository.save(product);

    await sut.execute({
      agribusiness_id: agribussines.id.toString(),
      products: [
        {
          product_id: product.id.toString(),
          amount: "6.60",
          quantity: "10",
          weight: "1.2",
        },
      ],
    });

    expect(inMemoryOffersRepository.items[0]).toBeInstanceOf(Offer);
    expect(inMemoryOffersRepository.items[0].status).toBe("PENDING");
    expect(
      inMemoryOffersProductsRepository.items[0].product_id.toString()
    ).toBe(product.id.toString());
  });

  it("should not be able to offer products that do not exist", async () => {
    const agribussines = Agribusiness.create({
      admin_id: new UniqueEntityID("fake-id"),
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepostory.save(agribussines);

    await expect(async () =>
      sut.execute({
        agribusiness_id: agribussines.id.toString(),
        products: [
          {
            product_id: "wrong-id",
            amount: "6.60",
            quantity: "10",
            weight: "1.2",
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
