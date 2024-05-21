import { OneTimePasswordsRepository } from "../../repositories/one-time-passwords-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { RegisterSessionUseCase } from "./register-session";

interface AuthenticateWithOneTimePasswordRequest {
  email: string;
  one_time_password: string;
  ip_address: string;
  user_agent: string;
}

export class AuthenticateWithOneTimePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private oneTimePasswordsRepository: OneTimePasswordsRepository,
    private registerSessionUseCase: RegisterSessionUseCase
  ) {}

  async execute({
    email,
    one_time_password,
    ip_address,
    user_agent,
  }: AuthenticateWithOneTimePasswordRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new WrongCredentialsError();
    }

    const oneTimePassword =
      await this.oneTimePasswordsRepository.findValidByUserId(user.id.value);

    if (!oneTimePassword || oneTimePassword.value !== one_time_password) {
      throw new WrongCredentialsError();
    }

    if (!user.verified_at) {
      throw new UserNotVerifiedError();
    }

    oneTimePassword.expire();

    await this.oneTimePasswordsRepository.update(oneTimePassword);

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
