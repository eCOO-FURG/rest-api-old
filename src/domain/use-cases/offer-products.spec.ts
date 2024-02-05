import { OfferProductsUseCase } from "./offer-products";
import { Agribusiness } from "../entities/agribusiness";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { Offer } from "../entities/offer";
import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products-repository";
import { Product } from "../entities/product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { InMemoryProductsTypesRepository } from "test/repositories/in-memory-products-types-repository";
import { ProductType } from "../entities/product-type";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";
import { InvalidWeightError } from "./errors/invalid-weight-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let inMemoryOffersProductsRepository: InMemoryOffersProductsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryProductsTypesRepository: InMemoryProductsTypesRepository;
let sut: OfferProductsUseCase;

describe("offer product", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOffersProductsRepository = new InMemoryOffersProductsRepository(
      inMemoryOffersRepository
    );
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryProductsTypesRepository = new InMemoryProductsTypesRepository();

    sut = new OfferProductsUseCase(
      inMemoryAgribusinessesRepository,
      inMemoryOffersRepository,
      inMemoryOffersProductsRepository,
      inMemoryProductsRepository
    );
  });

  it("should be able to offer products", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    const agribussines = Agribusiness.create({
      admin_id: account.id,
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepository.save(agribussines);

    const productType = ProductType.create(
      {
        name: "herbaceous",
      },
      new UniqueEntityID("1")
    );

    inMemoryProductsTypesRepository.save(productType);

    const product = Product.create({
      name: "potato",
      image: "potato.url",
      type_id: new UniqueEntityID("1"),
      pricing: "WEIGHT",
    });

    await inMemoryProductsRepository.save(product);

    await sut.execute({
      agribusiness_id: agribussines.id.toString(),
      products: [
        {
          id: product.id.toString(),
          price: 6.6,
          quantity_or_weight: 50,
        },
      ],
    });

    expect(inMemoryOffersRepository.items[0]).toBeInstanceOf(Offer);
    expect(
      inMemoryOffersProductsRepository.items[0].product_id.toString()
    ).toBe(product.id.toString());
  });

  it("should not be able to offer products that do not exist", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    const agribussines = Agribusiness.create({
      admin_id: account.id,
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepository.save(agribussines);

    await expect(async () =>
      sut.execute({
        agribusiness_id: agribussines.id.toString(),
        products: [
          {
            id: "wrong-id",
            price: 6.6,
            quantity_or_weight: 10,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should no be able to offer products with an invalid weight", async () => {
    const account = Account.create({
      email: "test@gmail.com",
      password: "password",
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    const agribussines = Agribusiness.create({
      admin_id: account.id,
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepository.save(agribussines);

    const product = Product.create({
      name: "potato",
      image: "potato.url",
      type_id: new UniqueEntityID("1"),
      pricing: "WEIGHT",
    });

    await inMemoryProductsRepository.save(product);

    await expect(async () =>
      sut.execute({
        agribusiness_id: agribussines.id.toString(),
        products: [
          {
            id: product.id.toString(),
            price: 6.6,
            quantity_or_weight: 10,
          },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });
});
