import { DomainEvents } from "@/core/events/domain-events";
import { Encrypter } from "../cryptography/encrypter";
import { AccountsRepository } from "../repositories/accounts-repository";
import { InvalidValidationCodeError } from "./errors/invalid-validation-code-error";

interface VerifyUseCaseRequest {
  code: string;
}

export class VerifyUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({ code }: VerifyUseCaseRequest) {
    const decryptedCode = await this.encrypter.decode(code);

    if (!decryptedCode || decryptedCode.account_id === null) {
      throw new InvalidValidationCodeError();
    }

    const account = await this.accountsRepository.findById(
      decryptedCode.account_id
    );

    if (!account) {
      throw new InvalidValidationCodeError();
    }

    if (account.verified_at) {
      return;
    }

    account.verify();

    await this.accountsRepository.update(account);

    DomainEvents.dispatchEventsForAggregate(account.id);
  }
}
