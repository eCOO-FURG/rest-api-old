import { Customer } from "../entities/customer";

export interface PaymentsProcessor {
  registerCustomer(customer: Customer): Promise<void>;
}
