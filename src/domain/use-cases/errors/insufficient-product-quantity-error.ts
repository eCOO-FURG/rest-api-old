export class InsufficientProductQuantityError extends Error {
  constructor(product_id: string) {
    super(`Insufficient quantity available for product ${product_id}`);
  }
}
