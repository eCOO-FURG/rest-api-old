import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountAlreadyVerified } from "@/domain/use-cases/errors/account-already-verified-error";
import { VerifyUseCase } from "@/domain/use-cases/verify";
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

    await verifyUseCase.execute({
      code,
    });

    return reply.status(200).send();
  } catch (err) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof AccountAlreadyVerified
    ) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
