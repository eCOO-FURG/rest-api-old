import { RedirectsRepository } from "../../repositories/redirects-repository";
import { Redirect } from "@/domain/entities/redirect";
import { User } from "@/domain/entities/user";

interface CreateRegisterRedirectUseCaseRequest {
  url?: string;
  user_id: User["id"];
}

const DEFAULT_REDIRECT_URL = "https://ecoo.org.br/";
export const REGISTER_REDIRECT_PREFIX = "register_";

export class CreateRegisterRedirectUseCase {
  constructor(private redirectsRepository: RedirectsRepository) {}

  async execute({ user_id, url }: CreateRegisterRedirectUseCaseRequest) {
    const redirect = Redirect.create(
      {
        url: url || DEFAULT_REDIRECT_URL,
      },
      REGISTER_REDIRECT_PREFIX + user_id.value
    );

    if (await this.redirectsRepository.findById(redirect.id)) {
      await this.redirectsRepository.delete(redirect.id);
    }

    await this.redirectsRepository.save(redirect);

    return { url: redirect.url };
  }
}
