import { User } from "@/domain/entities/user";
import { RedirectsRepository } from "../../repositories/redirects-repository";
import { UnexistentRedirectCodeError } from "../errors/unexistent-redirect-code";
import { REGISTER_REDIRECT_PREFIX } from "./create-register-redirect";

interface RetrieveRegisterRedirectUseCaseRequest {
  user_id: User["id"];
}

export class RetrieveRegisterRedirectUseCase {
  constructor(private redirectsRepository: RedirectsRepository) {}

  async execute({ user_id }: RetrieveRegisterRedirectUseCaseRequest) {
    const id = REGISTER_REDIRECT_PREFIX + user_id.value;

    const redirect = await this.redirectsRepository.findById(id);

    if (!redirect) {
      throw new UnexistentRedirectCodeError();
    }

    await this.redirectsRepository.delete(id);

    return { url: redirect.url };
  }
}
