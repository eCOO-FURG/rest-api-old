import { DomainEvents } from "@/core/events/domain-events";
import { Hasher } from "../cryptography/hasher";
import { Account } from "../entities/account";
import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";
import { AccountsRepository } from "../repositories/accounts-repository";
import { PeopleRepository } from "../repositories/people-repository";
import { ResourceAlreadyExistsError } from "../../core/errors/resource-already-exists-error";
import { Cellphone } from "../entities/value-objects/cellphone";

interface RegisterUseCaseRequest {
  email: string;
  cellphone: string;
  password: string;
  first_name: string;
  last_name: string;
  cpf: string;
}

export class RegisterUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private peopleRepository: PeopleRepository,
    private hasher: Hasher
  ) {}

  async execute({
    email,
    cellphone,
    password,
    first_name,
    last_name,
    cpf,
  }: RegisterUseCaseRequest) {
    const accountWithSameEmail = await this.accountsRepository.findByEmail(
      email
    );

    if (accountWithSameEmail) {
      throw new ResourceAlreadyExistsError(email);
    }

    const accountWithSameCellphone =
      await this.accountsRepository.findByCellphone(
        Cellphone.createFromText(cellphone)
      );

    if (accountWithSameCellphone) {
      throw new ResourceAlreadyExistsError(cellphone);
    }

    const personWithSameCPF = await this.peopleRepository.findByCpf(
      Cpf.createFromText(cpf)
    );

    if (personWithSameCPF) {
      throw new ResourceAlreadyExistsError(cpf);
    }

    const hashedPassword = await this.hasher.hash(password);

    const account = Account.create({
      email,
      cellphone: Cellphone.createFromText(cellphone),
      password: hashedPassword,
    });

    const person = Person.create({
      first_name,
      last_name,
      cpf: Cpf.createFromText(cpf),
      account_id: account.id,
    });

    await this.accountsRepository.save(account);
    await this.peopleRepository.save(person);

    DomainEvents.dispatchEventsForAggregate(account.id);
  }
}
