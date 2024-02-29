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
import { FakePaymentsProcessor } from "test/payments/fake-payment-processor";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { InsufficientProductQuantityOrWeightError } from "./errors/insufficient-product-quantity-or-weight-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrdersProductsRepository: InMemoryOrdersProductsRepository;
let fakePaymentsProcessor: FakePaymentsProcessor;
let sut: OrderProductsUseCase;

describe("order products", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryOrdersProductsRepository = new InMemoryOrdersProductsRepository();
    fakePaymentsProcessor = new FakePaymentsProcessor();
    sut = new OrderProductsUseCase(
      inMemoryProductsRepository,
      inMemoryOffersProductsRepository,
      inMemoryOrdersRepository,
      inMemoryOrdersProductsRepository,
      fakePaymentsProcessor,
      inMemoryAccountsRepository
    );
  });

  it("should be able to order products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          image: "potato.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "UNIT",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "apple",
          image: "apple.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "WEIGHT",
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save([
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 4,
      }),
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 2,
        offer_id: new UniqueEntityID("2"),
        quantity_or_weight: 4,
      }),
      OfferProduct.create({
        product_id: new UniqueEntityID("2"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 200,
      }),
      OfferProduct.create({
        product_id: new UniqueEntityID("2"),
        price: 2,
        offer_id: new UniqueEntityID("2"),
        quantity_or_weight: 100,
      }),
    ]);

    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    await inMemoryAccountsRepository.save(account);

    const result = await sut.execute({
      account_id: account.id.toString(),
      products: [
        {
          id: "1",
          quantity_or_weight: 6,
        },
        {
          id: "2",
          quantity_or_weight: 250,
        },
      ],
      shipping_address: "shipping address",
      payment_method: "ON_DELIVERY",
    });

    expect(result.value).toBe("308");
    expect(inMemoryOffersProductsRepository.items[0].quantity_or_weight).toBe(
      0
    );
    expect(inMemoryOffersProductsRepository.items[1].quantity_or_weight).toBe(
      2
    );
    expect(inMemoryOffersProductsRepository.items[2].quantity_or_weight).toBe(
      0
    );
    expect(inMemoryOffersProductsRepository.items[3].quantity_or_weight).toBe(
      50
    );
    expect(inMemoryOrdersRepository.items[0]).toBeInstanceOf(Order);
    expect(inMemoryOrdersRepository.items).toHaveLength(1);
  });

  it("should not be able to order an unavailable quantity of products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          image: "potato.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "UNIT",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryOffersProductsRepository.save([
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 2,
      }),
    ]);

    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    await inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        shipping_address: "shipping address",
        payment_method: "PIX",
        products: [
          {
            id: "1",
            quantity_or_weight: 1000,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an unavailable weight of products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          image: "potato.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "WEIGHT",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryOffersProductsRepository.save([
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 2,
      }),
    ]);

    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    await inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        shipping_address: "shipping address",
        payment_method: "PIX",
        products: [
          {
            id: "1",
            quantity_or_weight: 1000,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an invalid weight products", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          image: "potato.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "WEIGHT",
        },
        new UniqueEntityID("1")
      )
    );

    await inMemoryOffersProductsRepository.save([
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 2,
      }),
    ]);

    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    await inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        shipping_address: "shipping address",
        payment_method: "PIX",
        products: [
          {
            id: "1",
            quantity_or_weight: 40,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to order products that do not exist", async () => {
    await inMemoryProductsRepository.save(
      Product.create(
        {
          name: "potato",
          image: "potato.jpg",
          type_id: new UniqueEntityID("1"),
          pricing: "WEIGHT",
        },
        new UniqueEntityID("2")
      )
    );

    await inMemoryOffersProductsRepository.save([
      OfferProduct.create({
        product_id: new UniqueEntityID("1"),
        price: 1,
        offer_id: new UniqueEntityID("1"),
        quantity_or_weight: 2,
      }),
    ]);

    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    await inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        shipping_address: "shipping address",
        payment_method: "PIX",
        products: [
          {
            id: "1",
            quantity_or_weight: 2,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
