import { User } from "@/domain/entities/user";
import { UsersRepository } from "@/domain/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async save(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const item = this.items.find((item) => item.email === email);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const item = this.items.find((item) => item.phone === phone);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const item = this.items.find((item) => item.cpf === cpf);

    if (!item) {
      return null;
    }

    return item;
  }
}
