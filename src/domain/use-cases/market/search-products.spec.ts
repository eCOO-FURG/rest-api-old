import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { SearchProductsUseCase } from "./search-products";
import { Product } from "../../entities/product";
import { UUID } from "@/core/entities/uuid";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: SearchProductsUseCase;

describe("search products", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new SearchProductsUseCase(inMemoryProductsRepository);
  });

  it("should be able to search products", async () => {
    const product = Product.create({
      image: "fake-image",
      name: "product",
      pricing: "UNIT",
      type_id: new UUID("fake-id"),
    });

    await inMemoryProductsRepository.save(product);

    const result = await sut.execute({
      name: "product",
      page: 1,
    });

    expect(result.products).toHaveLength(1);
  });
});
