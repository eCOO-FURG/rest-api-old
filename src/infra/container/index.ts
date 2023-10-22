import { diContainer as container } from "@fastify/awilix";
import { Lifetime, asClass, asFunction, asValue } from "awilix";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { BcrypterHasher } from "../cryptography/bcrypt-hasher";
import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import * as JwtService from "jsonwebtoken";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { createTransport } from "nodemailer";
import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { env } from "../env";
import { Nodemailer } from "../mail/nodemailer";
import { EjsLoader } from "../mail/ejs-loader";
import { VerifyUseCase } from "@/domain/use-cases/verify";
import { PrismaAccountsRepository } from "../database/repositories/prisma-accounts-repository";
import { PrismaPeopleRepository } from "../database/repositories/prisma-people-repository";
import { PrismaSessionsRepository } from "../database/repositories/prisma-sessions-repository";
import { SendEmailUseCase } from "@/domain/use-cases/send-email";
import { RegisterProductUseCase } from "@/domain/use-cases/register-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryOffersProductsRepository } from "test/repositories/in-memory-offers-products";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";

// Dependencies
container.register({
  accountsRepository: asClass(PrismaAccountsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  peopleRepository: asClass(PrismaPeopleRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  sessionsRepository: asClass(PrismaSessionsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  productsRepository: asClass(InMemoryProductsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  agribusinessesRepository: asClass(InMemoryAgribusinessesRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  offersRepository: asClass(InMemoryOffersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  offersProductsRepository: asClass(InMemoryOffersProductsRepository, {
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
    ({ sendEmailUseCase, peopleRepository, encrypter, viewLoader }) =>
      new OnUserRegistered(
        sendEmailUseCase,
        peopleRepository,
        encrypter,
        viewLoader
      )
  ),
});

// Use-cases
export const useCases = {
  registerUseCase: asFunction(
    ({ accountsRepository, peopleRepository, hasher }) =>
      new RegisterUseCase(accountsRepository, peopleRepository, hasher),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  authenticateUseCase: asFunction(
    ({ accountsRepository, sessionsRepository, hasher, encrypter }) =>
      new AuthenticateUseCase(
        accountsRepository,
        sessionsRepository,
        hasher,
        encrypter
      )
  ),
  getUserProfileUseCase: asFunction(
    ({ accountsRepository, peopleRepository }) =>
      new GetUserProfileUseCase(accountsRepository, peopleRepository)
  ),
  refreshUseCase: asFunction(
    ({ accountsRepository, sessionsRepository, encrypter }) =>
      new RefreshUseCase(accountsRepository, sessionsRepository, encrypter)
  ),
  sendEmailUseCase: asFunction(({ mailer }) => new SendEmailUseCase(mailer)),
  verifyUseCase: asFunction(
    ({ accountsRepository, encrypter }) =>
      new VerifyUseCase(accountsRepository, encrypter)
  ),
  registerAgribusinessUseCase: asFunction(
    ({ accountsRepository, agribusinessesRepository }) =>
      new RegisterAgribusinessUseCase(
        accountsRepository,
        agribusinessesRepository
      )
  ),
  registerProductUseCase: asFunction(
    ({ productsRepository }) => new RegisterProductUseCase(productsRepository)
  ),
  offerProductsUseCase: asFunction(
    ({
      accountsRepository,
      agribusinessesRepository,
      offersRepository,
      offersProductsRepository,
      productsRepository,
    }) =>
      new OfferProductsUseCase(
        accountsRepository,
        agribusinessesRepository,
        offersRepository,
        offersProductsRepository,
        productsRepository
      )
  ),
};
