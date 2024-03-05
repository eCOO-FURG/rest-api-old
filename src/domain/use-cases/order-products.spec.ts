import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { OrderProductsUseCase } from "./order-products";
import { Product } from "../entities/product";
import { OfferProduct } from "../entities/offer-product";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UUID } from "@/core/entities/uuid";
import { User } from "../entities/user";
import { Offer } from "../entities/offer";
import { Order } from "../entities/order";
import { InsufficientProductQuantityOrWeightError } from "./errors/insufficient-product-quantity-or-weight-error";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: OrderProductsUseCase;

describe("order products", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOffersRepository
    );
    sut = new OrderProductsUseCase(
      inMemoryUsersRepository,
      inMemoryProductsRepository,
      inMemoryOffersRepository,
      inMemoryOrdersRepository
    );
  });

  it("should be able to order products", async () => {
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
      price: 9.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 50,
    });

    const offerProduct4 = OfferProduct.create({
      offer_id: offer.id,
      price: 9.0,
      product_id: product2.id,
      quantity_or_weight: 100,
    });

    offer.add(offerProduct1);
    offer.add(offerProduct2);
    offer.add(offerProduct3);
    offer.add(offerProduct4);

    await inMemoryOffersRepository.save(offer);

    const result = await sut.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "shipping-address",
      products: [
        {
          id: product1.id.value,
          quantity_or_weight: 18,
        },
        { id: product2.id.value, quantity_or_weight: 100 },
      ],
    });

    expect(result.order).toBeInstanceOf(Order);
  });

  it("should not be able to order an unavailable quantity of products", async () => {
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
      price: 9.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 50,
    });

    const offerProduct4 = OfferProduct.create({
      offer_id: offer.id,
      price: 9.0,
      product_id: product2.id,
      quantity_or_weight: 100,
    });

    offer.add(offerProduct1);
    offer.add(offerProduct2);
    offer.add(offerProduct3);
    offer.add(offerProduct4);

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            quantity_or_weight: 21,
          },
          { id: product2.id.value, quantity_or_weight: 50 },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an unavailable weight of products", async () => {
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
      price: 9.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 50,
    });

    const offerProduct4 = OfferProduct.create({
      offer_id: offer.id,
      price: 9.0,
      product_id: product2.id,
      quantity_or_weight: 100,
    });

    offer.add(offerProduct1);
    offer.add(offerProduct2);
    offer.add(offerProduct3);
    offer.add(offerProduct4);

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            quantity_or_weight: 18,
          },
          { id: product2.id.value, quantity_or_weight: 200 },
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientProductQuantityOrWeightError);
  });

  it("should not be able to order an invalid weight products", async () => {
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
      price: 9.0,
      product_id: product1.id,
      quantity_or_weight: 10,
    });

    const offerProduct3 = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product2.id,
      quantity_or_weight: 50,
    });

    const offerProduct4 = OfferProduct.create({
      offer_id: offer.id,
      price: 9.0,
      product_id: product2.id,
      quantity_or_weight: 100,
    });

    offer.add(offerProduct1);
    offer.add(offerProduct2);
    offer.add(offerProduct3);
    offer.add(offerProduct4);

    await inMemoryOffersRepository.save(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: product1.id.value,
            quantity_or_weight: 18,
          },
          { id: product2.id.value, quantity_or_weight: 90 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to order products that do not exist", async () => {
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
        payment_method: "ON_DELIVERY",
        shipping_address: "shipping-address",
        products: [
          {
            id: "fake-id",
            quantity_or_weight: 18,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
