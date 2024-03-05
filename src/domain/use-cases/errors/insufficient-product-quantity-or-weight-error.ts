import { Product } from "@/domain/entities/product";

const mapper = {
  UNIT: "Quantidade",
  WEIGHT: "Peso",
};

export class InsufficientProductQuantityOrWeightError extends Error {
  constructor(pricing: Product["pricing"], product_id: string) {
    super(`${mapper[pricing]} indisponível para o produto ${product_id}`);
  }
}
