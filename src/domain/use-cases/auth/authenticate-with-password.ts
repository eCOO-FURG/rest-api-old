import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { Hasher } from "../../cryptography/hasher";
import { RegisterSessionUseCase } from "./register-session";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";
import { PasswordNotSettedError } from "../errors/password-not-setted";

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

    if (!user.password) {
      throw new PasswordNotSettedError();
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);

    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    if (!user.verified_at) {
      throw new UserNotVerifiedError();
    }

    const { token } = await this.registerSessionUseCase.execute({
      user_id: user.id.value,
      ip_address,
      user_agent,
    });

    return {
      token,
      user,
    };
  }
}
