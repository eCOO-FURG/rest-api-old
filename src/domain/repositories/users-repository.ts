import { User } from "../entities/user";

export interface UsersRepository {
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
