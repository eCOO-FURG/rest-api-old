import { RegisterOneTimePasswordUseCase } from "@/domain/use-cases/auth/register-one-time-password";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

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

    request.diScope.resolve("onOneTimePasswordRegistered");

    await registerOneTimePassword.execute({
      email,
    });

    return reply.status(201).send();
  } catch (err) {
    handleErrors(err, reply);
    throw err;
  }
}
