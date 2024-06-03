import { DomainEvents } from "@/core/events/domain-events";
import { Hasher } from "../../cryptography/hasher";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists-error";
import { User } from "../../entities/user";
import { UsersRepository } from "../../repositories/users-repository";
import { Cpf } from "@/domain/entities/value-objects/cpf";
import { InvalidCpfFormatError } from "@/domain/entities/value-objects/errors/invalid-cpf-format-error copy";

interface RegisterUseCaseRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  cpf: string;
  phone: string;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher
  ) {}

  async execute({
    email,
    phone,
    password,
    first_name,
    last_name,
    cpf,
  }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ResourceAlreadyExistsError("Email", email);
    }

    const userWithSamePhone = await this.usersRepository.findByPhone(phone);

    if (userWithSamePhone) {
      throw new ResourceAlreadyExistsError("Telefone", phone);
    }

    const userWithSameCpf = await this.usersRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      throw new ResourceAlreadyExistsError("CPF", cpf);
    }
    
    try {
      Cpf.createFromText(cpf);
    } catch (error) {
      if (error instanceof InvalidCpfFormatError) {
        throw new Error("CPF inválido");
      } else {
        throw error;
      }
    }

    const user = User.create({
      first_name,
      last_name,
      cpf: cpf,
      email,
      phone,
    });

    if (password) {
      const hashedPassword = await this.hasher.hash(password);
      user.protect(hashedPassword);
    }

    await this.usersRepository.save(user);

    DomainEvents.dispatchEventsForEntity(user.id);
  }
}
