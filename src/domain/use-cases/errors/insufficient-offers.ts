export class InsufficientOffers extends Error {
  constructor(product_id: string) {
    super(`Insufficient offers for ${product_id}`);
  }
}
