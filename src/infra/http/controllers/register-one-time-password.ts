import { RegisterOneTimePasswordUseCase } from "@/domain/use-cases/register-one-time-password";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const registerOneTimePasswordBodySchema = z.object({
  email: z.string(),
});

export async function registerOneTimePassword(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email } = registerOneTimePasswordBodySchema.parse(request.body);

  try {
    const registerOneTimePassword =
      request.diScope.resolve<RegisterOneTimePasswordUseCase>(
        "registerOneTimePasswordUseCase"
      );

    await registerOneTimePassword.execute({
      email,
    });

    return reply.status(201).send();
  } catch (err) {
    throw err;
  }
}
