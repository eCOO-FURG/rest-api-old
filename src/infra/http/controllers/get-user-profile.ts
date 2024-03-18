import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserPresenter } from "../presenters/user-presenter";
import { GetUserProfileUseCase } from "@/domain/use-cases/user/get-user-profile";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const getUserProfileUseCase =
      request.diScope.resolve<GetUserProfileUseCase>("getUserProfileUseCase");

    const { user } = await getUserProfileUseCase.execute({
      user_id: request.payload.user_id,
    });

    return reply.status(200).send(UserPresenter.toHttp(user));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
