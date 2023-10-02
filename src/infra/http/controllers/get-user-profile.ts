import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserPresenter } from "../presenters/user-presenter";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const getUserProfile = request.diScope.resolve<GetUserProfileUseCase>(
      "getUserProfileUseCase"
    );

    const { account, person } = await getUserProfile.execute({
      account_id: request.payload.sub,
    });

    return reply.status(200).send(UserPresenter.toHttp(account, person));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
