import { AccountsRepository } from "../repositories/accounts-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Hasher } from "../cryptography/hasher";
import { AccountNotVerifiedError } from "./errors/account-not-verified-error";
import { RegisterSessionUseCase } from "./register-session";

interface AuthenticateRequest {
  email: string;
  password: string;
  ip_address: string;
  user_agent: string;
}

export class AuthenticateWithPasswordUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private hasher: Hasher,
    private registerSessionUseCase: RegisterSessionUseCase
  ) {}

  async execute({
    email,
    password,
    ip_address,
    user_agent,
  }: AuthenticateRequest) {
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

    if (!account.verified_at) {
      throw new AccountNotVerifiedError();
    }

    const accessToken = await this.registerSessionUseCase.execute({
      account_id: account.id.toString(),
      ip_address,
      user_agent,
    });

    return {
      accessToken,
    };
  }
}
