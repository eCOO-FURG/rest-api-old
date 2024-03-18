import { RefreshUseCase } from "@/domain/use-cases/auth/refresh";
import { SessionExpiredError } from "@/domain/use-cases/errors/session-expired-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const refreshBodySchema = z.object({
  token: z.string(),
});

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const { token } = refreshBodySchema.parse(request.body);

  try {
    const refreshUseCase =
      request.diScope.resolve<RefreshUseCase>("refreshUseCase");

    const { token: newToken } = await refreshUseCase.execute({
      access_token: token,
      user_agent: request.headers["user-agent"] || "not-identified",
      ip_address: request.ip,
    });

    return reply.status(200).send({
      access_token: newToken,
    });
  } catch (err) {
    if (err instanceof SessionExpiredError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
