import { Account } from "../entities/account";
import { Person } from "../entities/person";

export interface SendEmailUseCaseRequest {
  account: Account;
  person: Person;
}

export class SendEmailUseCase {
  constructor() {}

  async execute({ account, person }: SendEmailUseCaseRequest) {
    console.log(account, person);
  }
}
