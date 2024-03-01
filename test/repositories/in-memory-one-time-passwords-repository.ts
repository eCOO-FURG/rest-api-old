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
    const index = this.items.findIndex((item) =>
      item.id.equals(oneTimePassword.id)
    );

    if (index < 0) {
      return;
    }

    this.items[index] = oneTimePassword;
  }

  async findValidByUserId(user_id: string): Promise<OneTimePassword | null> {
    const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);

    const item = this.items.find(
      (item) =>
        item.user_id.equals(user_id) &&
        item.used === false &&
        item.created_at > fifteenMinutesAgo
    );

    if (!item) {
      return null;
    }

    return item;
  }

  async expirePreviousForUserId(user_id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.user_id.equals(user_id));

    if (index < 0) {
      return;
    }

    this.items[index].expire();
  }
}
