import { PaymentsProcessor } from "../payments/payments-processor";

interface CreateTransactionUseCaseRequest {}

export class CreateTransactionUseCase {
  constructor(paymentsProcessor: PaymentsProcessor) {}

  async execute({}: CreateTransactionUseCaseRequest) {
    console.log("PAGAMENTO EFETUADO");
  }
}
