import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error";
import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AccountNotVerified } from "@/domain/use-cases/errors/account-not-verified";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = request.diScope.resolve<AuthenticateUseCase>(
      "authenticateUseCase"
    );

    const { access_token } = await authenticateUseCase.execute({
      email,
      password,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"] || "not-identified",
    });

    return reply.status(200).send({
      access_token,
    });
  } catch (err) {
    if (
      err instanceof WrongCredentialsError ||
      err instanceof AccountNotVerified
    ) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
