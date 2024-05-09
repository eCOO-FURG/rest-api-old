import { RequestPasswordUpdateUseCase } from "@/domain/use-cases/user/request-password-update";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

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
    handleErrors(err, reply);
    throw err;
  }
}
