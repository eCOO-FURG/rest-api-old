import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserNotVerifiedError } from "@/domain/use-cases/errors/user-not-verified-error";
import { AuthenticateWithPasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-password";
import { UserPresenter } from "../presenters/user-presenter";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function authenticateWithPassword(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateWithPasswordUseCase =
      request.diScope.resolve<AuthenticateWithPasswordUseCase>(
        "authenticateWithPasswordUseCase"
      );

    const { token, user } = await authenticateWithPasswordUseCase.execute({
      email,
      password,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"] ?? "not-identified",
    });

    return reply.status(200).send({
      token,
      user: UserPresenter.toHttp(user),
    });
  } catch (err) {
    if (
      err instanceof WrongCredentialsError ||
      err instanceof UserNotVerifiedError
    ) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
