import { AccountsRepository } from "../repositories/accounts-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Encrypter } from "../cryptography/encrypter";
import { Hasher } from "../cryptography/hasher";
import { SessionsRepository } from "../repositories/sessions-repository";
import { Session } from "../entities/session";
import { AccountNotVerified } from "./errors/account-not-verified";

interface AuthenticateRequest {
  email: string;
  password: string;
  ip_address: string;
  user_agent: string;
}

export class AuthenticateUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private sessionsRepository: SessionsRepository,
    private hasher: Hasher,
    private encrypter: Encrypter
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
      throw new AccountNotVerified();
    }

    const session = Session.create({
      account_id: account.id,
      ip_address,
      user_agent,
    });

    await this.sessionsRepository.save(session);

    const access_token = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return {
      access_token,
    };
  }
}
