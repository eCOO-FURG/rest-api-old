import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidCellphoneFormatError } from "@/domain/entities/value-objects/errors/invalid-cellphone-format-error";
import { InvalidCpfFormatError } from "@/domain/entities/value-objects/errors/invalid-cpf-format-error copy";
import { AlreadyAgribusinessAdminError } from "@/domain/use-cases/errors/already-agribusiness-admin-error";
import { InsufficientProductQuantityOrWeightError } from "@/domain/use-cases/errors/insufficient-product-quantity-or-weight-error";
import { InvalidCycleError } from "@/domain/use-cases/errors/invalid-cycle-error";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";
import { InvalidDescriptionError } from "@/domain/use-cases/errors/invalid-description-length.error";
import { InvalidOrderStatusError } from "@/domain/use-cases/errors/invalid-order-status-error";
import { InvalidValidationCodeError } from "@/domain/use-cases/errors/invalid-validation-code-error";
import { InvalidWeightError } from "@/domain/use-cases/errors/invalid-weight-error";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { SessionExpiredError } from "@/domain/use-cases/errors/session-expired-error";
import { UserNotVerifiedError } from "@/domain/use-cases/errors/user-not-verified-error";
import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error";
import { FastifyReply } from "fastify";

export function handleErrors(err: any, reply: FastifyReply) {
  if (
    err instanceof WrongCredentialsError ||
    err instanceof UserNotVerifiedError ||
    err instanceof InvalidDescriptionError ||
    err instanceof InvalidWeightError ||
    err instanceof InsufficientProductQuantityOrWeightError ||
    err instanceof SessionExpiredError ||
    err instanceof InvalidCycleError ||
    err instanceof InvalidCpfFormatError ||
    err instanceof InvalidCellphoneFormatError ||
    err instanceof InvalidOrderStatusError
  ) {
    return reply.status(400).send({ message: err.message });
  }
  if (err instanceof InvalidValidationCodeError) {
    return reply.status(401).send({ message: err.message });
  }
  if (err instanceof InvalidDayForCycleActionError) {
    return reply.status(403).send({ message: err.message });
  }
  if (err instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: err.message });
  }
  if (
    err instanceof ResourceAlreadyExistsError ||
    err instanceof AlreadyAgribusinessAdminError
  ) {
    return reply.status(409).send({ message: err.message });
  }
}
