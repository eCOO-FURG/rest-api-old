import { SingleAgribusinessListingUseCase } from "@/domain/use-cases/single-agribusiness-listing";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AgribusinessPresenter } from "../presenters/agribusiness-presenter";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

export const singleAgribusinessListingQuerySchema = z.object({
  agribusiness_id: z.string(),
});

export async function singleAgribusinessListing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { agribusiness_id } = singleAgribusinessListingQuerySchema.parse(
    request.params
  );

  try {
    const singleAgribusinessListingUseCase =
      request.diScope.resolve<SingleAgribusinessListingUseCase>(
        "singleAgribusinessListingUseCase"
      );

    const agribusiness = await singleAgribusinessListingUseCase.execute({
      agribusiness_id: agribusiness_id,
    });

    return reply.status(200).send(AgribusinessPresenter.toHttp([agribusiness]));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send("Agribusiness not found");
    }
  }
}
