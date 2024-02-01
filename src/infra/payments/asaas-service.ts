import { Customer } from "@/domain/entities/customer";
import { PaymentsProcessor } from "@/domain/payments/payments-processor";
import { env } from "../env";
import { Charge } from "@/domain/entities/charge";
import { Payment } from "@/domain/entities/payment";

const assasUrls: Record<typeof env.ENV, string> = {
  production: "https://asaas.com/api/v3",
  test: "https://sandbox.asaas.com/api/v3",
  dev: "https://sandbox.asaas.com/api/v3",
};

const assasUrl = assasUrls[env.ENV];

export class Asaas implements PaymentsProcessor {
  async registerCustomer(customer: Customer): Promise<void> {
    await fetch(`${assasUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: env.PAYMENTS_PROCESSOR_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpf.value,
      }),
    });
  }

  async registerCharge(charge: Charge): Promise<Payment> {
    const customerResponse = await fetch(
      `${assasUrl}/customers?email=${charge.customer_email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: env.PAYMENTS_PROCESSOR_API_KEY,
        },
      }
    );

    const customerData = await customerResponse.json();
    const customerRefence = customerData.data[0].id;

    const chargeResponse = await fetch(`${assasUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: env.PAYMENTS_PROCESSOR_API_KEY,
      },
      body: JSON.stringify({
        customer: customerRefence,
        billingType: charge.payment_method,
        value: charge.value,
        dueDate: charge.due_date.toISOString().split("T")[0],
        externalReference: charge.order_id.toString(),
      }),
    });

    const chargeData = await chargeResponse.json();
    const chargeReference = chargeData.id;

    const paymentResponse = await fetch(
      `${assasUrl}/payments/${chargeReference}/pixQrCode`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: env.PAYMENTS_PROCESSOR_API_KEY,
        },
      }
    );

    const paymentData = await paymentResponse.json();
    const { encodedImage, payload } = paymentData;

    const payment = Payment.create({
      charge_id: charge.id,
      value: charge.value,
      key: payload,
      qrcode: encodedImage,
      expiration_date: charge.due_date,
    });

    return payment;
  }
}
