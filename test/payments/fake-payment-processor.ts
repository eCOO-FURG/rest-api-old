import { PaymentProcessor } from "@/domain/payments/payment-processor";

export class FakePaymentProcessor implements PaymentProcessor {
  createTransaction(params: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
