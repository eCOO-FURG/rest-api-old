import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Session } from "../entities/session";
import { SessionsRepository } from "../repositories/sessions-repository";
import { Encrypter } from "../cryptography/encrypter";

interface RegisterSessionUseCaseRequest {
  account_id: string;
  ip_address: string;
  user_agent: string;
}

export class RegisterSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    account_id,
    ip_address,
    user_agent,
  }: RegisterSessionUseCaseRequest) {
    const session = Session.create({
      account_id: new UniqueEntityID(account_id),
      ip_address,
      user_agent,
    });

    await this.sessionsRepository.save(session);

    const accessToken = await this.encrypter.encrypt({
      sub: account_id,
    });

    return accessToken;
  }
}
