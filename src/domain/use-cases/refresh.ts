import { Encrypter } from "../cryptography/encrypter";
import { AccountsRepository } from "../repositories/accounts-repository";
import { SessionsRepository } from "../repositories/sessions-repository";
import { SessionExpiredError } from "./errors/session-expired-error";

interface RefreshRequest {
  access_token: string;
  ip_address: string;
}

export class RefreshUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private sessionsRepository: SessionsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({ access_token, ip_address }: RefreshRequest) {
    const { sub } = await this.encrypter.decode(access_token);

    const account = await this.accountsRepository.findById(sub);

    if (!account) {
      throw new SessionExpiredError();
    }

    const session =
      await this.sessionsRepository.findValidSessionByAccountIdAndIpAddress(
        sub,
        ip_address
      );

    if (!session) {
      throw new SessionExpiredError();
    }

    const newAccessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return {
      newAccessToken,
    };
  }
}
