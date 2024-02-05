export class InvalidWeightError extends Error {
  constructor(action: "offered" | "ordered", product_name: string) {
    super(`Invalid weight ${action} for product ${product_name}.`);
  }
}
