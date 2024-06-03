// Entities
import { Session } from "@/domain/entities/session";

// Services
import { Hasher } from "@/domain/cryptography/hasher";
import { Encrypter } from "@/domain/cryptography/encrypter";

// Repositories
import { UsersRepository } from "@/domain/repositories/users-repository";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";
import { OneTimePasswordsRepository } from "@/domain/repositories/one-time-passwords-repository";

// Errors
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { PasswordNotSettedError } from "../errors/password-not-setted";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
  ip_address: string;
  user_agent: string;
  type: "OTP" | "BASIC";
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
    private oneTimePasswordsRepository: OneTimePasswordsRepository,
    private encrypter: Encrypter,
    private hasher: Hasher
  ) {}

  async execute({
    email,
    password,
    ip_address,
    user_agent,
    type,
  }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new WrongCredentialsError();
    }

    switch (type) {
      case "BASIC":
        if (!user.password) throw new PasswordNotSettedError();

        const isPasswordValid = await this.hasher.compare(
          password,
          user.password
        );

        if (!isPasswordValid) throw new WrongCredentialsError();
        break;
      case "OTP":
        const otp = await this.oneTimePasswordsRepository.findValidByUserId(
          user.id.value
        );

        if (!otp || otp.value !== password) throw new WrongCredentialsError();

        otp.expire();

        await this.oneTimePasswordsRepository.update(otp);
        break;
    }

    if (!user.verified_at) {
      throw new UserNotVerifiedError();
    }

    const session = Session.create({
      user_id: user.id,
      ip_address,
      user_agent,
    });

    await this.sessionsRepository.save(session);

    const token = await this.encrypter.encrypt({ user_id: user.id.value });

    return {
      token,
    };
  }
}
