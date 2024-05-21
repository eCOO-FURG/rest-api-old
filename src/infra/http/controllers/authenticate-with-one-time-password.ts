import { AuthenticateWithOneTimePasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-one-time-password";
import { UserNotVerifiedError } from "@/domain/use-cases/errors/user-not-verified-error";
import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserPresenter } from "../presenters/user-presenter";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  one_time_password: z.string().min(6),
});

export async function authenticateWithOneTimePassword(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, one_time_password } = authenticateBodySchema.parse(
    request.body
  );

  try {
    const authenticateWithPasswordUseCase =
      request.diScope.resolve<AuthenticateWithOneTimePasswordUseCase>(
        "authenticateWithOneTimePasswordUseCase"
      );

    const { token, user } = await authenticateWithPasswordUseCase.execute({
      email,
      one_time_password,
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
