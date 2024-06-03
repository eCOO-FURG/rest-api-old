import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthenticateWithPasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-password";
import { HttpErrorHandler } from "../errors/error-handler";
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
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
