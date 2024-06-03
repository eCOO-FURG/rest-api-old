import { FastifyReply, FastifyRequest } from "fastify";
import { CyclePresenter } from "../presenters/cycle-presenter";
import { ListCycleUseCase } from "@/domain/use-cases/market/list-cycles";
import { HttpErrorHandler } from "./errors/error-handler";

export async function listCycles(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listCyclesUseCase =
      request.diScope.resolve<ListCycleUseCase>("listCyclesUseCase");

    const { cycles } = await listCyclesUseCase.execute();

    return reply
      .status(200)
      .send(cycles.map((cycle) => CyclePresenter.toHttp(cycle)));
  } catch (err) {
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
