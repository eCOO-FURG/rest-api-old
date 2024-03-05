import { DomainEvents } from "@/core/events/domain-events";
import { OtpGenerator } from "../cryptography/otp-generator";
import { OneTimePassword } from "../entities/one-time-password";
import { OneTimePasswordsRepository } from "../repositories/one-time-passwords-repository";
import { UsersRepository } from "../repositories/users-repository";

interface RegisterOneTimePasswordRequest {
  email: string;
}

export class RegisterOneTimePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private otpGenerator: OtpGenerator,
    private oneTimePasswordsRepository: OneTimePasswordsRepository
  ) {}

  async execute({ email }: RegisterOneTimePasswordRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await this.oneTimePasswordsRepository.expirePreviousForUserId(
      user.id.value
    );

    const oneTimePassword = OneTimePassword.create({
      user_id: user.id,
      value: await this.otpGenerator.generate(),
    });

    await this.oneTimePasswordsRepository.save(oneTimePassword);

    DomainEvents.dispatchEventsForEntity(oneTimePassword.id);
  }
}
