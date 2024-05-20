import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { VerifyUseCase } from "@/domain/use-cases/auth/verify";
import { InvalidValidationCodeError } from "@/domain/use-cases/errors/invalid-validation-code-error";
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

    const user = await verifyUseCase.execute({
      code,
    });

    request.diScope.resolve("onUserVerified");

    await verifyUseCase.execute({
      code,
    });

    let redirectUrl = `${env.CDD_FRONT_URL}`;

    if (user!.roles.includes("ADMIN")) {
      redirectUrl = `${env.CDD_FRONT_URL}`;
    } else if (user!.roles.includes("PRODUCER")) {
      redirectUrl = `${env.PRODUCER_FRONT_URL}`;
    } else if (user!.roles.includes("USER")) {
      redirectUrl = `${env.CDD_FRONT_URL}`;
    }

    return reply.redirect(301, redirectUrl).send({});
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
