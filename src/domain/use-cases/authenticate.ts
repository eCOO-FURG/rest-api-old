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
    const acount = await this.accountsRepository.findByEmail(email);

    if (!acount) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.hasher.compare(
      password,
      acount.password
    );

    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    const token = await this.encrypter.encrypt({
      sub: acount.id.toString(),
    });

    return token;
  }
}
