import { InvalidCellphoneFormatError } from "@/domain/entities/value-objects/errors/invalid-cellphone-format-error";
import { InvalidCpfFormatError } from "@/domain/entities/value-objects/errors/invalid-cpf-format-error copy";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email(),
  cellphone: z.string(),
  password: z.string().min(8),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string().max(14),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { email, cellphone, password, first_name, last_name, cpf } =
    registerBodySchema.parse(request.body);

  try {
    const registerUseCase =
      request.diScope.resolve<RegisterUseCase>("registerUseCase");

    request.diScope.resolve("onUserRegistered");

    await registerUseCase.execute({
      email,
      phone: cellphone,
      password,
      first_name,
      last_name,
      cpf,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (
      err instanceof InvalidCpfFormatError ||
      err instanceof InvalidCellphoneFormatError
    ) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
