import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { OrderListingUseCase } from "./order-listing";
import { OrderProductsUseCase } from "./order-products";
import { UUID } from "@/core/entities/uuid";
import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";
import { Product } from "../entities/product";
import { User } from "../entities/user";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let orderProductsUseCase: OrderProductsUseCase;
let sut: OrderListingUseCase;

describe("order listing", () => {
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
    sut = new OrderListingUseCase(inMemoryOrdersRepository);
  });

  it("should be able to list an specific order", async () => {
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

    await sut.execute({ order_id: orderResult.order.id.value });

    expect(inMemoryOrdersRepository.items[0].shipping_address).toBe(
      "rua qualquer"
    );
  });

  it("should not be able to show an order because id is invalid", async () => {
    await expect(async () => {
      await sut.execute({
        order_id: "ahhahahha",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
