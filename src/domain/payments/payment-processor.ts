export interface PaymentProcessor {
  createTransaction(params: unknown): Promise<unknown>;
}
