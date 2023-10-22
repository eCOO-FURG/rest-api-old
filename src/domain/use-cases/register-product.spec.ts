import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { Product } from "../entities/product";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { RegisterProductUseCase } from "./register-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: RegisterProductUseCase;

describe("create product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new RegisterProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to create a product", async () => {
    await sut.execute({
      name: "new-product",
    });

    expect(inMemoryProductsRepository.items[0]).toBeInstanceOf(Product);
  });

  it("should not able to create a product with the same name twice", async () => {
    await sut.execute({
      name: "new-product",
    });

    await expect(async () =>
      sut.execute({
        name: "new-product",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
