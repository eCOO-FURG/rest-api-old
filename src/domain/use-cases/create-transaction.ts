import { PaymentProcessor } from "../payments/payment-processor";

interface CreateTransactionUseCaseRequest {}

export class CreateTransactionUseCase {
  constructor(paymentProcessor: PaymentProcessor) {}

  async execute({}: CreateTransactionUseCaseRequest) {
    console.log("PAGAMENTO EFETUADO");
  }
}
