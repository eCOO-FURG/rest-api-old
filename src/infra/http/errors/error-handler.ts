import { FastifyReply } from "fastify";
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

type ErrorConstructor<T extends Error> = new (...args: any[]) => T;

const HTTPStatusCodes: { [key: number]: ErrorConstructor<Error>[] } = {
  400: [
    InvalidCellphoneFormatError,
    InvalidCpfFormatError,
    InsufficientProductQuantityOrWeightError,
    InvalidCycleError,
    InvalidDescriptionError,
    InvalidOrderStatusError,
    InvalidWeightError,
  ],
  401: [InvalidValidationCodeError, SessionExpiredError, WrongCredentialsError],
  403: [
    AlreadyAgribusinessAdminError,
    InvalidDayForCycleActionError,
    ResourceAlreadyExistsError,
    UserNotVerifiedError,
  ],
  404: [ResourceNotFoundError],
};

export class HttpErrorHandler {
  static handle(error: unknown, reply: FastifyReply) {
    for (const code in HTTPStatusCodes) {
      if (
        HTTPStatusCodes[code].some((value) => error instanceof value) &&
        error instanceof Error
      ) {
        return reply.status(parseInt(code)).send({ message: error.message });
      }
    }
    throw error;
  }
}
