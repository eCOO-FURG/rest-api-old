import { SessionExpiredError } from "@/domain/use-cases/errors/session-expired-error";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const refreshBodySchema = z.object({
  access_token: z.string(),
});

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const { access_token } = refreshBodySchema.parse(request.body);

  try {
    const refreshUseCase =
      request.diScope.resolve<RefreshUseCase>("refreshUseCase");

    const { newAccessToken } = await refreshUseCase.execute({
      access_token,
      user_agent: request.headers["user-agent"] || "not-identified",
    });

    return reply.status(200).send({
      access_token: newAccessToken,
    });
  } catch (err) {
    if (err instanceof SessionExpiredError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
