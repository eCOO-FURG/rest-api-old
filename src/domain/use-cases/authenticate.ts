import { AccountsRepository } from "../repositories/accounts-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Encrypter } from "../cryptography/encrypter";
import { Hasher } from "../cryptography/hasher";

interface AuthenticateRequest {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private hasher: Hasher,
    private encrypter: Encrypter
  ) {}

  async execute({ email, password }: AuthenticateRequest) {
    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.hasher.compare(
      password,
      account.password
    );

    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    const token = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return token;
  }
}
