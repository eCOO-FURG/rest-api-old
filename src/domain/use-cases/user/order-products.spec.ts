import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { OrderProductsUseCase } from "./order-products";
import { Product } from "../../entities/product";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UUID } from "@/core/entities/uuid";
import { User } from "../../entities/user";
import { Offer } from "../../entities/offer";
import { Order } from "../../entities/order";
import { InsufficientProductQuantityOrWeightError } from "../errors/insufficient-product-quantity-or-weight-error";
import { InvalidWeightError } from "../errors/invalid-weight-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Cycle } from "../../entities/cycle";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { ValidadeCycleActionUseCase } from "../market/validate-cycle-action";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let validadeCycleActionUseCase: ValidadeCycleActionUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: OrderProductsUseCase;

describe("order products", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    validadeCycleActionUseCase = new ValidadeCycleActionUseCase(
      inMemoryCyclesRepository
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOffersRepository
    );
    sut = new OrderProductsUseCase(
      validadeCycleActionUseCase,
      inMemoryUsersRepository,
      inMemoryProductsRepository,
      inMemoryOffersRepository,
      inMemoryOrdersRepository
    );
  });

  it("should be able to order products", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "WEIGHT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
    });

    offer.add({
      product: product1,
      amount: 20,
      price: 10.0,
    });

    offer.add({
      product: product2,
      price: 9.0,
      amount: 120,
    });

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "shipping-address",
      products: [
        {
          id: product1.id.value,
          amount: 18,
        },
        { id: product2.id.value, amount: 100 },
      ],
    });

    expect(result.order).toBeInstanceOf(Order);
  });

  it("should not be able to order an unavailable quantity of products", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "WEIGHT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
    });

    offer.add({
      product: product1,
      price: 10.0,
      amount: 19,
    });

    offer.add({
      product: product2,
      price: 9.0,
      amount: 50,
    });

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            amount: 21,
          },
          { id: product2.id.value, amount: 50 },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an unavailable weight of products", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "WEIGHT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
    });

    offer.add({
      product: product1,
      price: 10.0,
      amount: 10,
    });

    offer.add({
      product: product2,
      price: 10.0,
      amount: 50,
    });

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            amount: 5,
          },
          { id: product2.id.value, amount: 55 },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an invalid weight products", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "WEIGHT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer = Offer.create({
      cycle_id: cycle.id,
      agribusiness_id: new UUID("fake-id"),
    });

    offer.add({
      product: product1,
      price: 10.0,
      amount: 20,
    });

    offer.add({
      product: product2,
      price: 9.0,
      amount: 100,
    });

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            amount: 18,
          },
          { id: product2.id.value, amount: 90 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to order products that do not exist", async () => {
    const cycle = Cycle.create({
      alias: "Ciclo 1",
      duration: 7,
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
    });

    await inMemoryCyclesRepository.save(cycle);

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: "fake-id",
            amount: 18,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
