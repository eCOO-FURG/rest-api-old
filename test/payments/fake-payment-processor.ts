import { Customer } from "@/domain/entities/customer";
import { PaymentsProcessor } from "@/domain/payments/payments-processor";

export class FakePaymentsProcessor implements PaymentsProcessor {
  createTransaction(params: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  async registerCustomer(customer: Customer): Promise<void> {}
}
