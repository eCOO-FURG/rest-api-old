import { AccountsRepository } from "../repositories/accounts-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Hasher } from "../cryptography/hasher";
import { AccountNotVerifiedError } from "./errors/account-not-verified-error";
import { RegisterSessionUseCase } from "./register-session";
import { UsersRepository } from "../repositories/users-repository";

interface AuthenticateRequest {
  email: string;
  password: string;
  ip_address: string;
  user_agent: string;
}

export class AuthenticateWithPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private registerSessionUseCase: RegisterSessionUseCase
  ) {}

  async execute({
    email,
    password,
    ip_address,
    user_agent,
  }: AuthenticateRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);

    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    if (!user.verified_at) {
      throw new AccountNotVerifiedError();
    }

    const { token } = await this.registerSessionUseCase.execute({
      user_id: user.id.value,
      ip_address,
      user_agent,
    });

    return {
      token,
    };
  }
}
