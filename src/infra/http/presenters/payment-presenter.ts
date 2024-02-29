import { Payment } from "@/domain/entities/payment";

export class PaymentPresenter {
  static toHttp(payment: Payment) {
    const charge_id = payment.charge_id
      ? payment.charge_id.toString()
      : undefined;

    const qrcode = payment.qrcode
      ? Buffer.from(payment.qrcode, "base64").toJSON().data
      : undefined;

    return {
      charge_id,
      key: payment.key,
      value: payment.value,
      qrcode,
      expiration_date: payment.expiration_date,
    };
  }
}
