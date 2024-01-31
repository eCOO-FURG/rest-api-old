import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { VerifyUseCase } from "@/domain/use-cases/verify";
import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const vefiryQuerySchema = z.object({
  code: z.string(),
});

export async function verify(request: FastifyRequest, reply: FastifyReply) {
  const { code } = vefiryQuerySchema.parse(request.query);

  try {
    const verifyUseCase =
      request.diScope.resolve<VerifyUseCase>("verifyUseCase");

    request.diScope.resolve("onUserVerified");

    await verifyUseCase.execute({
      code,
    });

    return reply.redirect(301, `${env.SERVER_URL}:3000/login`);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
