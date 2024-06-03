import { RegisterUseCase } from "@/domain/use-cases/user/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpErrorHandler } from "./errors/error-handler";

export const registerBodySchema = z.object({
  email: z.string().email(),
  cellphone: z.string(),
  password: z.string().min(8).optional(),
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
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
