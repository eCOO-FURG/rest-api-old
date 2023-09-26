import { Account } from "../entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";

interface CreateAccountUseCaseRequest {
  email: string;
  password: string;
}

export class CreateAccountUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({ email, password }: CreateAccountUseCaseRequest) {
    const accountWithSameEmail = await this.accountsRepository.findByEmail(
      email
    );

    if (accountWithSameEmail) {
      throw new AccountAlreadyExistsError(email);
    }

    const hashedPassword = "hashed-password"; // implement hash

    const account = Account.create({
      email,
      password: hashedPassword,
    });

    await this.accountsRepository.save(account);

    return account;
  }
}
