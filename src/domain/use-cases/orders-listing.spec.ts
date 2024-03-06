import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { OrdersListingUseCase } from "./orders-listing";
import { Product } from "../entities/product";
import { UUID } from "@/core/entities/uuid";
import { User } from "../entities/user";
import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";
import { Order } from "../entities/order";
import { OrderProductsUseCase } from "./order-products";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let orderProductsUseCase: OrderProductsUseCase;
let sut: OrdersListingUseCase;

describe("orders listing", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOffersRepository
    );
    orderProductsUseCase = new OrderProductsUseCase(
      inMemoryUsersRepository,
      inMemoryProductsRepository,
      inMemoryOffersRepository,
      inMemoryOrdersRepository
    );
    sut = new OrdersListingUseCase(inMemoryOrdersRepository);
  });

  it("should be able to list orders", async () => {
    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);

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

    const offerProduct = OfferProduct.create({
      offer_id: offer.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 100,
    });

    offer.add(offerProduct);

    await inMemoryOffersRepository.save(offer);

    const orderResult = await orderProductsUseCase.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "rua qualquer",
      products: [
        {
          id: product1.id.value,
          quantity_or_weight: 18,
        },
      ],
    });

    const orders = await sut.execute({ page: 1 });
    console.log("Orders received:", orders);

    expect(orders).toHaveLength(1);
  });

  it("should able to list an array with 2 orders", async () => {
    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);
    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "janedoe@example.com",
      phone: "51987654321",
      password: "87654321",
      first_name: "Jane",
      last_name: "Doe",
      cpf: "987.654.321-09",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer1 = Offer.create({
      agribusiness_id: new UUID("fake-id-1"),
    });

    const offer2 = Offer.create({
      agribusiness_id: new UUID("fake-id-2"),
    });

    const offerProduct1 = OfferProduct.create({
      offer_id: offer1.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 50,
    });

    const offerProduct2 = OfferProduct.create({
      offer_id: offer2.id,
      price: 8.0,
      product_id: product2.id,
      quantity_or_weight: 30,
    });

    offer1.add(offerProduct1);
    offer2.add(offerProduct2);

    await inMemoryOffersRepository.save(offer1);
    await inMemoryOffersRepository.save(offer2);

    const orderResult1 = await orderProductsUseCase.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "rua qualquer",
      products: [
        {
          id: product1.id.value,
          quantity_or_weight: 10,
        },
      ],
    });

    const orderResult2 = await orderProductsUseCase.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "outra rua qualquer",
      products: [
        {
          id: product2.id.value,
          quantity_or_weight: 15,
        },
      ],
    });

    const orders = await sut.execute({ page: 1 });
    expect(orders).toHaveLength(2);
  });

  it("should show an empty array when page 2 is shown", async () => {
    const product1 = Product.create({
      name: "apple",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    const product2 = Product.create({
      name: "banana",
      image: "image",
      pricing: "UNIT",
      type_id: new UUID("id"),
    });

    await inMemoryProductsRepository.save(product1);
    await inMemoryProductsRepository.save(product2);

    const user = User.create({
      email: "janedoe@example.com",
      phone: "51987654321",
      password: "87654321",
      first_name: "Jane",
      last_name: "Doe",
      cpf: "987.654.321-09",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const offer1 = Offer.create({
      agribusiness_id: new UUID("fake-id-1"),
    });

    const offer2 = Offer.create({
      agribusiness_id: new UUID("fake-id-2"),
    });

    const offerProduct1 = OfferProduct.create({
      offer_id: offer1.id,
      price: 10.0,
      product_id: product1.id,
      quantity_or_weight: 50,
    });

    const offerProduct2 = OfferProduct.create({
      offer_id: offer2.id,
      price: 8.0,
      product_id: product2.id,
      quantity_or_weight: 30,
    });

    offer1.add(offerProduct1);
    offer2.add(offerProduct2);

    await inMemoryOffersRepository.save(offer1);
    await inMemoryOffersRepository.save(offer2);

    const orderResult1 = await orderProductsUseCase.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "rua qualquer",
      products: [
        {
          id: product1.id.value,
          quantity_or_weight: 10,
        },
      ],
    });

    const orderResult2 = await orderProductsUseCase.execute({
      user_id: user.id.value,
      payment_method: "ON_DELIVERY",
      shipping_address: "outra rua qualquer",
      products: [
        {
          id: product2.id.value,
          quantity_or_weight: 15,
        },
      ],
    });

    const orders = await sut.execute({ page: 2 });
    expect(orders).toHaveLength(0);
  });
});
