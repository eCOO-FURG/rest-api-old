import { DomainEvents } from "@/core/events/domain-events";
import { Encrypter } from "../../cryptography/encrypter";
import { InvalidValidationCodeError } from "../errors/invalid-validation-code-error";
import { UsersRepository } from "../../repositories/users-repository";

interface VerifyUseCaseRequest {
  code: string;
}

export class VerifyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) {}

  async execute({ code }: VerifyUseCaseRequest) {
    const decryptedCode = await this.encrypter.decode(code);

    if (!decryptedCode || !decryptedCode.user_id) {
      throw new InvalidValidationCodeError();
    }

    const user = await this.usersRepository.findById(decryptedCode.user_id);

    if (!user) {
      throw new InvalidValidationCodeError();
    }

    if (user.verified_at) {
      return user;
    }

    user.verify();

    await this.usersRepository.update(user);

    DomainEvents.dispatchEventsForEntity(user.id);

    return user;
  }
}
