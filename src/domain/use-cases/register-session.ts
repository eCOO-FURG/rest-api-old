import { Session } from "../entities/session";
import { SessionsRepository } from "../repositories/sessions-repository";
import { Encrypter } from "../cryptography/encrypter";
import { UUID } from "@/core/entities/uuid";

interface RegisterSessionUseCaseRequest {
  user_id: string;
  ip_address: string;
  user_agent: string;
}

export class RegisterSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    user_id,
    ip_address,
    user_agent,
  }: RegisterSessionUseCaseRequest) {
    const session = Session.create({
      user_id: new UUID(user_id),
      ip_address,
      user_agent,
    });

    await this.sessionsRepository.save(session);

    const token = await this.encrypter.encrypt({
      user_id,
    });

    return {
      token,
    };
  }
}
