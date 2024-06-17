import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { VerifyUseCase } from "@/domain/use-cases/auth/verify";
import { InvalidValidationCodeError } from "@/domain/use-cases/errors/invalid-validation-code-error";
import { RetrieveRegisterRedirectUseCase } from "@/domain/use-cases/apps/retrieve-register-redirect";

export const vefiryQuerySchema = z.object({
  code: z.string(),
});

export async function verify(request: FastifyRequest, reply: FastifyReply) {
  const { code } = vefiryQuerySchema.parse(request.query);

  try {
    const verifyUseCase =
      request.diScope.resolve<VerifyUseCase>("verifyUseCase");
    const retrieveRegisterRedirectUseCase =
      request.diScope.resolve<RetrieveRegisterRedirectUseCase>(
        "retrieveRegisterRedirectUseCase"
      );

    request.diScope.resolve("onUserVerified");

    const { id } = await verifyUseCase.execute({
      code,
    });

    const { url } = await retrieveRegisterRedirectUseCase.execute({
      user_id: id,
    });

    return reply.redirect(301, url).send({});
  } catch (err) {
    if (err instanceof InvalidValidationCodeError) {
      return reply.status(401).send({ message: err.message });
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
