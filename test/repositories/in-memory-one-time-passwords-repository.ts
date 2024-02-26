import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OneTimePassword } from "@/domain/entities/one-time-password";
import { OneTimePasswordsRepository } from "@/domain/repositories/one-time-passwords-repository";

export class InMemoryOneTimePasswordsRepository
  implements OneTimePasswordsRepository
{
  items: OneTimePassword[] = [];

  async save(oneTimePassword: OneTimePassword): Promise<void> {
    this.items.push(oneTimePassword);
  }

  async expirePreviousOneTimePassword(account_id: string): Promise<void> {
    const previousOneTimePasswordIndex = this.items.findIndex((item) =>
      item.account_id.equals(new UniqueEntityID(account_id))
    );

    if (previousOneTimePasswordIndex < 0) {
      return;
    }

    this.items[previousOneTimePasswordIndex].expire();
  }
}
