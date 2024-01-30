import { Payment } from "@/domain/entities/payment";

export class PaymentPresenter {
  static toHttp(payment: Payment) {
    const qrcode = Buffer.from(payment.qrcode, "base64");

    return {
      charge_id: payment.charge_id.toString(),
      key: payment.key,
      value: payment.value,
      qrcode: qrcode.toJSON().data,
      expiration_date: payment.expiration_date,
    };
  }
}
