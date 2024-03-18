import { Encrypter } from "../../cryptography/encrypter";
import { SessionsRepository } from "../../repositories/sessions-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { SessionExpiredError } from "../errors/session-expired-error";

interface RefreshRequest {
  access_token: string;
  user_agent: string;
  ip_address: string;
}

export class RefreshUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({ access_token, user_agent, ip_address }: RefreshRequest) {
    const { user_id } = await this.encrypter.decode(access_token);

    if (!user_id) {
      throw new SessionExpiredError();
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new SessionExpiredError();
    }

    const session = await this.sessionsRepository.findValidSession(
      user_id,
      user_agent,
      ip_address
    );

    if (!session) {
      throw new SessionExpiredError();
    }

    const token = await this.encrypter.encrypt({
      user_id,
    });

    return {
      token,
    };
  }
}
