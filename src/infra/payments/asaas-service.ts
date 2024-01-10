import { Customer } from "@/domain/entities/customer";
import { PaymentsProcessor } from "@/domain/payments/payments-processor";
import { env } from "../env";

const assasUrls: Record<typeof env.ENV, string> = {
  production: "https://asaas.com/api/v3",
  test: "https://sandbox.asaas.com/api/v3",
  dev: "https://sandbox.asaas.com/api/v3",
};

const assasUrl = assasUrls[env.ENV];

export class Asaas implements PaymentsProcessor {
  async registerCustomer(customer: Customer): Promise<void> {
    console.log(env.PAYMENTS_PROCESSOR_API_KEY);

    await fetch(`${assasUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: env.PAYMENTS_PROCESSOR_API_KEY,
      },
      body: JSON.stringify({
        name: customer.full_name,
        cpfCnpj: customer.cpf,
      }),
    }).then((data) => {
      console.log(data);

      if (data.status != 200) {
      } // log issue
    });
  }
}
