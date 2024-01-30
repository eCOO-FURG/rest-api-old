import { Charge } from "../entities/charge";
import { Customer } from "../entities/customer";
import { Payment } from "../entities/payment";

export interface PaymentsProcessor {
  registerCustomer(customer: Customer): Promise<void>;
  registerCharge(charge: Charge): Promise<Payment>;
}
