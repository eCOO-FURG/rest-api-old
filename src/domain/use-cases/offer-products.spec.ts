import { OfferProductsUseCase } from "./offer-products";
import { Agribusiness } from "../entities/agribusiness";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { Offer } from "../entities/offer";
import { Product } from "../entities/product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { UUID } from "@/core/entities/uuid";
import { AgribusinessNotActiveError } from "./errors/agribusiness-not-active-error";

let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: OfferProductsUseCase;

describe("offer product", () => {
  beforeEach(() => {
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();

    sut = new OfferProductsUseCase(
      inMemoryAgribusinessesRepository,
      inMemoryOffersRepository,
      inMemoryProductsRepository
    );
  });

  it("should be able to offer products", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-name",
    });

    await inMemoryAgribusinessesRepository.save(agribusiness);

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

    await sut.execute({
      agribusiness_id: agribusiness.id.value,
      products: [
        {
          id: product1.id.value,
          price: 10.0,
          quantity_or_weight: 100,
        },
        {
          id: product2.id.value,
          price: 10.0,
          quantity_or_weight: 5,
        },
      ],
    });

    expect(inMemoryOffersRepository.items[0]).toBeInstanceOf(Offer);
  });

  it("should not be able to offer products that do not exist", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-name",
    });

    const product1 = Product.create({
      image: "image",
      name: "banana",
      pricing: "WEIGHT",
      type_id: new UUID("fake-id"),
    });

    await inMemoryProductsRepository.save(product1);

    await expect(() =>
      sut.execute({
        agribusiness_id: agribusiness.id.value,
        products: [
          {
            id: product1.id.value,
            price: 10.0,
            quantity_or_weight: 100,
          },
          {
            id: "fake-id",
            price: 10.0,
            quantity_or_weight: 5,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer products from an agribusiness that do not exist", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-name",
    });

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

    await expect(() =>
      sut.execute({
        agribusiness_id: agribusiness.id.value,
        products: [
          {
            id: product1.id.value,
            price: 10.0,
            quantity_or_weight: 100,
          },
          {
            id: product2.id.value,
            price: 10.0,
            quantity_or_weight: 5,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer items with an invalid weight", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-name",
    });

    await inMemoryAgribusinessesRepository.save(agribusiness);

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

    await expect(() =>
      sut.execute({
        agribusiness_id: agribusiness.id.value,
        products: [
          {
            id: product1.id.value,
            price: 10.0,
            quantity_or_weight: 30,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to offer from an inactive agribusiness", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-name",
      active: false,
    });

    await inMemoryAgribusinessesRepository.save(agribusiness);

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

    await expect(() =>
      sut.execute({
        agribusiness_id: agribusiness.id.value,
        products: [
          {
            id: product1.id.value,
            price: 10.0,
            quantity_or_weight: 30,
          },
        ],
      })
    ).rejects.toBeInstanceOf(AgribusinessNotActiveError);
  });
});
