import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { InMemoryOrdersProductsRepository } from "test/repositories/in-memory-orders-products-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { OrderProductsUseCase } from "../use-cases/order-products";
import { OnProductsOrdered } from "./on-products-ordered";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { Product } from "../entities/product";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrdersProductsRepository: InMemoryOrdersProductsRepository;
let orderProductsUseCase: OrderProductsUseCase;

let createTransactionUseCase: CreateTransactionUseCase;
let createTransactionUseCaseSpy: SpyInstance;

describe("on products ordered", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryOrdersProductsRepository = new InMemoryOrdersProductsRepository();
    orderProductsUseCase = new OrderProductsUseCase(
      inMemoryProductsRepository,
      inMemoryOffersProductsRepository,
      inMemoryOrdersRepository,
      inMemoryOrdersProductsRepository
    );

    createTransactionUseCase = new CreateTransactionUseCase();
    createTransactionUseCaseSpy = vi.spyOn(createTransactionUseCase, "execute");

    new OnProductsOrdered(createTransactionUseCase);
  });

  it("should create a transaction when a order is made", async () => {
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
        amount: "1",
        offer_id: new UniqueEntityID("1"),
        quantity: "2",
        weight: "2",
      })
    );

    await orderProductsUseCase.execute({
      account_id: "1",
      order: [
        {
          product_id: "1",
          quantity: 2,
        },
      ],
    });

    await waitFor(() => {
      expect(createTransactionUseCaseSpy).toHaveBeenCalled();
    });
  });
});
