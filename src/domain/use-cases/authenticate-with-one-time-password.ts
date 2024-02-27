import { AccountsRepository } from "../repositories/accounts-repository";
import { OneTimePasswordsRepository } from "../repositories/one-time-passwords-repository";
import { AccountNotVerifiedError } from "./errors/account-not-verified-error";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { RegisterSessionUseCase } from "./register-session";

interface AuthenticateWithOneTimePasswordRequest {
  email: string;
  one_time_password: string;
  ip_address: string;
  user_agent: string;
}

export class AuthenticateWithOneTimePasswordUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private oneTimePasswordsRepository: OneTimePasswordsRepository,
    private registerSessionUseCase: RegisterSessionUseCase
  ) {}

  async execute({
    email,
    one_time_password,
    ip_address,
    user_agent,
  }: AuthenticateWithOneTimePasswordRequest) {
    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      throw new WrongCredentialsError();
    }

    const oneTimePassword =
      await this.oneTimePasswordsRepository.findValidByAccountId(
        account.id.toString()
      );

    if (!oneTimePassword) {
      throw new WrongCredentialsError();
    }

    if (oneTimePassword.value !== one_time_password) {
      throw new WrongCredentialsError();
    }

    if (!account.verified_at) {
      throw new AccountNotVerifiedError();
    }

    oneTimePassword.expire();

    await this.oneTimePasswordsRepository.update(oneTimePassword);

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
