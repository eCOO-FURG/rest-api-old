export class InsufficientProductQuantityOrWeightError extends Error {
  constructor(pricing: "quantity" | "weight", product_id: string) {
    super(`Insufficient ${pricing} available for product ${product_id}`);
  }
}
