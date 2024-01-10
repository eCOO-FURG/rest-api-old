import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { InMemoryOrdersProductsRepository } from "test/repositories/in-memory-orders-products-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { OrderProductsUseCase } from "./order-products";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Product } from "../entities/product";
import { OfferProduct } from "../entities/offer-product";
import { Order } from "../entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InsufficientProductQuantityError } from "./errors/insufficient-product-quantity-error";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrdersProductsRepository: InMemoryOrdersProductsRepository;
let sut: OrderProductsUseCase;

describe("order products", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryOrdersProductsRepository = new InMemoryOrdersProductsRepository();
    sut = new OrderProductsUseCase(
      inMemoryProductsRepository,
      inMemoryOffersProductsRepository,
      inMemoryOrdersRepository,
      inMemoryOrdersProductsRepository
    );
  });

  it("should be able to order products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          type_id: new UniqueEntityID("1"),
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "apple",
          type_id: new UniqueEntityID("1"),
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: "1",
        offer_id: new UniqueEntityID("1"),
        quantity: 2,
        weight: "2",
      })
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        product_id: new UniqueEntityID("2"),
        price: "1",
        offer_id: new UniqueEntityID("1"),
        quantity: 2,
        weight: "2",
      })
    );

    await sut.execute({
      account_id: "1",
      order: [
        {
          product_id: "1",
          quantity: 2,
        },
        {
          product_id: "2",
          quantity: 2,
        },
      ],
    });

    expect(inMemoryOrdersRepository.items[0]).toBeInstanceOf(Order);
  });

  it("should not be able to order an unavailable quantity of products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          type_id: new UniqueEntityID("1"),
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: "1",
        offer_id: new UniqueEntityID("1"),
        quantity: 2,
        weight: "2",
      })
    );

    await expect(() =>
      sut.execute({
        account_id: "1",
        order: [
          {
            product_id: "1",
            quantity: 1000,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityError);
  });

  it("should not be able to order products that do not exist", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          type_id: new UniqueEntityID("1"),
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save(
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: "1",
        offer_id: new UniqueEntityID("1"),
        quantity: 2,
        weight: "2",
      })
    );

    await expect(() =>
      sut.execute({
        account_id: "1",
        order: [
          {
            product_id: "1",
            quantity: 2,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
