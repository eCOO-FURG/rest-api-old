import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCellphoneFormatError } from "@/domain/entities/value-objects/errors/invalid-cellphone-format-error";
import { InvalidCpfFormatError } from "@/domain/entities/value-objects/errors/invalid-cpf-format-error copy";
import { CreateRegisterRedirectUseCase } from "@/domain/use-cases/apps/create-register-redirect";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { RegisterUseCase } from "@/domain/use-cases/user/register";

export const registerBodySchema = z.object({
  email: z.string().email(),
  cellphone: z.string(),
  password: z.string().min(8).optional(),
  first_name: z.string(),
  last_name: z.string(),
  cpf: z.string().max(14),
  redirect_url: z.string().optional(),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const {
    email,
    cellphone,
    password,
    first_name,
    last_name,
    cpf,
    redirect_url,
  } = registerBodySchema.parse(request.body);

  try {
    const createRegisterRedirectUseCase =
      request.diScope.resolve<CreateRegisterRedirectUseCase>(
        "createRegisterRedirectUseCase"
      );
    const registerUseCase =
      request.diScope.resolve<RegisterUseCase>("registerUseCase");

    request.diScope.resolve("onUserRegistered");

    const { id } = await registerUseCase.execute({
      email,
      phone: cellphone,
      password,
      first_name,
      last_name,
      cpf,
    });

    await createRegisterRedirectUseCase.execute({
      user_id: id,
      url: redirect_url,
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
