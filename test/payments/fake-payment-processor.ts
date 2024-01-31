import { Charge } from "@/domain/entities/charge";
import { Customer } from "@/domain/entities/customer";
import { Payment } from "@/domain/entities/payment";
import { PaymentsProcessor } from "@/domain/payments/payments-processor";

export class FakePaymentsProcessor implements PaymentsProcessor {
  async registerCustomer(customer: Customer): Promise<void> {}

  async registerCharge(charge: Charge): Promise<Payment> {
    const payment = Payment.create({
      charge_id: charge.id,
      key: "r&@wMxcV]d3QLuSH=enVGs", // gerar uma chave pix de verdade
      expiration_date: charge.due_date,
      qrcode: "qrcode", // gerar um qrcode falso de verdade
      value: charge.value,
    });

    return payment;
  }
}
