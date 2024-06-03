import { VerifyUseCase } from "@/domain/use-cases/auth/verify";
import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpErrorHandler } from "../errors/error-handler";

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

    return reply.redirect(301, `${env.FRONT_URL}/login`).send({});
  } catch (err) {
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
