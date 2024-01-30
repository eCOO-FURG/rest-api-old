import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const brazillianCellphoneRegex = new RegExp(
  new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
);

export const registerBodySchema = z.object({
  email: z.string().email(),
  cellphone: z.string().regex(brazillianCellphoneRegex),
  password: z.string().min(8),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string().max(14),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = {
    ...(request.body as any),
    cellphone: (request.body as { cellphone: number })?.cellphone.toString(),
  };

  const { email, cellphone, password, first_name, last_name, cpf } =
    registerBodySchema.parse(body);

  try {
    const registerUseCase =
      request.diScope.resolve<RegisterUseCase>("registerUseCase");

    request.diScope.resolve("onUserRegistered");

    await registerUseCase.execute({
      email,
      cellphone,
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
    throw err;
  }
}
