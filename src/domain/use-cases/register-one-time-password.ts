import { DomainEvents } from "@/core/events/domain-events";
import { OtpGenerator } from "../cryptography/otp-generator";
import { OneTimePassword } from "../entities/one-time-password";
import { AccountsRepository } from "../repositories/accounts-repository";
import { OneTimePasswordsRepository } from "../repositories/one-time-passwords-repository";

interface RegisterOneTimePasswordRequest {
  email: string;
}

export class RegisterOneTimePasswordUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private otpGenerator: OtpGenerator,
    private oneTimePasswordsRepository: OneTimePasswordsRepository
  ) {}

  async execute({ email }: RegisterOneTimePasswordRequest) {
    const account = await this.accountsRepository.findByEmail(email);

    if (!account) {
      return;
    }

    await this.oneTimePasswordsRepository.expirePreviousOneTimePassword(
      account.id.toString()
    );

    const oneTimePassword = OneTimePassword.create({
      account_id: account.id,
      value: await this.otpGenerator.generate(),
    });

    await this.oneTimePasswordsRepository.save(oneTimePassword);

    DomainEvents.dispatchEventsForAggregate(oneTimePassword.id);
  }
}
