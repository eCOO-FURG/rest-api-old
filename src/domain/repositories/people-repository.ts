import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";

export interface PeopleRepository {
  findByCpf(cpf: Cpf): Promise<Person | null>;
  save(person: Person): Promise<void>;
}
