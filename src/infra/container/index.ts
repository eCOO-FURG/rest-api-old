import { diContainer as container } from "@fastify/awilix";
import { Lifetime, asClass, asFunction, asValue } from "awilix";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { BcrypterHasher } from "../cryptography/bcrypt-hasher";
import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import * as JwtService from "jsonwebtoken";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { SendUserVerificationEmailUseCase } from "@/domain/use-cases/send-user-verification-email";
import { createTransport } from "nodemailer";
import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { FakeMailer } from "test/mail/fake-mailer";
import { env } from "../env";
import { Nodemailer } from "../mail/nodemailer";
import { EjsLoader } from "../mail/ejs-loader";
import { VerifyUseCase } from "@/domain/use-cases/verify";

// Dependencies
container.register({
  accontsRepository: asClass(InMemoryAccountsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  peopleRepository: asClass(InMemoryPeopleRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  sessionsRepository: asClass(InMemorySessionsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  hasher: asClass(BcrypterHasher),
  encrypter: asFunction(() => new JwtEncrypter(JwtService)),
  mailer: asFunction(() => {
    const transporter = createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
    });
    return new Nodemailer(transporter);
  }),
  viewLoader: asFunction(() => new EjsLoader()),
});

// Events
container.register({
  onUserRegistered: asFunction(
    ({ peopleRepository, sendUserVerificationEmailUseCase }) =>
      new OnUserRegistered(peopleRepository, sendUserVerificationEmailUseCase)
  ),
});

// Use-cases
export const useCases = {
  registerUseCase: asFunction(
    ({ accontsRepository, peopleRepository, hasher }) =>
      new RegisterUseCase(accontsRepository, peopleRepository, hasher),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  authenticateUseCase: asFunction(
    ({ accontsRepository, sessionsRepository, hasher, encrypter }) =>
      new AuthenticateUseCase(
        accontsRepository,
        sessionsRepository,
        hasher,
        encrypter
      )
  ),
  getUserProfileUseCase: asFunction(
    ({ accontsRepository, peopleRepository }) =>
      new GetUserProfileUseCase(accontsRepository, peopleRepository)
  ),
  refreshUseCase: asFunction(
    ({ accontsRepository, sessionsRepository, encrypter }) =>
      new RefreshUseCase(accontsRepository, sessionsRepository, encrypter)
  ),
  sendUserVerificationEmailUseCase: asFunction(
    ({ mailer, viewLoader, encrypter }) =>
      new SendUserVerificationEmailUseCase(mailer, viewLoader, encrypter)
  ),
  verifyUseCase: asFunction(
    ({ accontsRepository, encrypter }) =>
      new VerifyUseCase(accontsRepository, encrypter)
  ),
};
