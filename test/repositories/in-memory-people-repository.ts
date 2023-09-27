import { Person } from "@/domain/entities/person";
import { Cpf } from "@/domain/entities/value-objects/cpf";
import { PeopleRepository } from "@/domain/repositories/people-repository";

export class InMemoryPeopleRepository implements PeopleRepository {
  public items: Person[] = [];

  async findByCpf(cpf: Cpf): Promise<Person | null> {
    const person = this.items.find((item) => item.cpf.value === cpf.value);

    if (!person) return null;

    return person;
  }

  async save(person: Person): Promise<void> {
    this.items.push(person);
  }
}
