import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { RequestPasswordUpdateUseCase } from "@/domain/use-cases/user/request-password-update";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const requestPasswordUpdateQuerySchema = z.object({
  email: z.string().email(),
});

export async function requestPasswordUpdate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email } = requestPasswordUpdateQuerySchema.parse(request.query);

    const requestPasswordUpdateUseCase =
      request.diScope.resolve<RequestPasswordUpdateUseCase>(
        "requestPasswordUpdateUseCase"
      );

    await requestPasswordUpdateUseCase.execute({
      email,
      path: "trocar-senha",
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
