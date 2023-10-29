import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Encrypter } from "../cryptography/encrypter";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AccountAlreadyVerified } from "./errors/account-already-verified-error";

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
      throw new ResourceNotFoundError(code);
    }

    const account = await this.accountsRepository.findById(
      decryptedCode.account_id
    );

    if (!account) {
      throw new ResourceNotFoundError(decryptedCode.account_id);
    }

    if (account.verified_at) {
      throw new AccountAlreadyVerified();
    }

    account.verify();

    await this.accountsRepository.update(account);
  }
}
