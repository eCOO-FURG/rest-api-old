import { HashService } from "../cryptography/hash-service";
import { Account } from "../entities/account";
import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";
import { AccountsRepository } from "../repositories/accounts-repository";
import { PeopleRepository } from "../repositories/people-repository";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";

interface RegisterUseCaseRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  cpf: string;
}

export class RegisterUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private peopleRepository: PeopleRepository,
    private hashService: HashService
  ) {}

  async execute({
    email,
    password,
    first_name,
    last_name,
    cpf,
  }: RegisterUseCaseRequest) {
    const accountWithSameEmail = await this.accountsRepository.findByEmail(
      email
    );

    if (accountWithSameEmail) {
      throw new AccountAlreadyExistsError(email);
    }

    const personWithSameCPF = await this.peopleRepository.findByCpf(
      Cpf.createFromText(cpf)
    );

    if (personWithSameCPF) {
      throw new AccountAlreadyExistsError(cpf);
    }

    const hashedPassword = await this.hashService.hash(password);

    const account = Account.create({
      email,
      password: hashedPassword,
    });

    const person = Person.create({
      first_name,
      last_name,
      cpf: Cpf.createFromText(cpf),
      account_id: account.id,
    });

    await Promise.all([
      this.accountsRepository.save(account),
      this.peopleRepository.save(person),
    ]);
  }
}
