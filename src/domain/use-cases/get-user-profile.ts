import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountsRepository } from "../repositories/accounts-repository";
import { PeopleRepository } from "../repositories/people-repository";

interface GetUserProfileUseCaserRequest {
  account_id: string;
}

export class GetUserProfileUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private peopleRepository: PeopleRepository
  ) {}

  async execute({ account_id }: GetUserProfileUseCaserRequest) {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const person = await this.peopleRepository.findByAccountId(account_id);

    if (!person) {
      throw new ResourceNotFoundError(account_id);
    }

    return {
      account,
      person,
    };
  }
}
