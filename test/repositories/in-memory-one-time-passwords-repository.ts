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

  async update(oneTimePassword: OneTimePassword): Promise<void> {
    const oneTimePasswordIndex = this.items.findIndex((item) =>
      item.id.equals(oneTimePassword.id)
    );

    if (oneTimePasswordIndex >= 0) {
      this.items[oneTimePasswordIndex] = oneTimePassword;
    }
  }

  async expirePreviousForAccountId(account_id: string): Promise<void> {
    const previousOneTimePasswordIndex = this.items.findIndex((item) =>
      item.account_id.equals(new UniqueEntityID(account_id))
    );

    if (previousOneTimePasswordIndex < 0) {
      return;
    }

    this.items[previousOneTimePasswordIndex].expire();
  }

  async findValidByAccountId(
    account_id: string
  ): Promise<OneTimePassword | null> {
    const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);

    const oneTimePassword = this.items.find(
      (item) =>
        item.used === false &&
        item.created_at > fifteenMinutesAgo &&
        item.account_id.equals(new UniqueEntityID(account_id))
    );

    if (!oneTimePassword) {
      return null;
    }

    return oneTimePassword;
  }
}
