import { diContainer } from "@fastify/awilix";
import { Lifetime, asClass, asFunction } from "awilix";
import { PrismaAccountsRepository } from "../database/repositories/prisma-accounts-repository";
import { PrismaPeopleRepository } from "../database/repositories/prisma-people-repository";
import { PrismaSessionsRepository } from "../database/repositories/prisma-sessions-repository";
import { PrismaProductsRepository } from "../database/repositories/prisma-products-repository";
import { PrismaAgribusinessesRepository } from "../database/repositories/prisma-agribusinesses-repository";
import { PrismaOffersRepository } from "../database/repositories/prisma-offers-repository";
import { PrismaOffersProductsRepository } from "../database/repositories/prisma-offers-products-repository";
import { BcrypterHasher } from "../cryptography/bcrypt-hasher";
import { createTransport } from "nodemailer";
import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import { env } from "../env";
import { EjsLoader } from "../mail/ejs-loader";
import { Nodemailer } from "../mail/nodemailer";
import * as JwtService from "jsonwebtoken";
import { PrismaOrdersRepository } from "../database/repositories/prisma-orders-repository";
import { PrismaOrderProductsRepository } from "../database/repositories/prisma-order-products-repository";
import { Asaas } from "../payments/asaas-service";
import { FakePaymentsProcessor } from "test/payments/fake-payment-processor";
import { NlpService } from "../search/nlp-service";
import { op } from "@tensorflow/tfjs-node";

diContainer.register({
  accountsRepository: asClass(PrismaAccountsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  peopleRepository: asClass(PrismaPeopleRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  sessionsRepository: asClass(PrismaSessionsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  productsRepository: asClass(PrismaProductsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  agribusinessesRepository: asClass(PrismaAgribusinessesRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  offersRepository: asClass(PrismaOffersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  offersProductsRepository: asClass(PrismaOffersProductsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  ordersRepository: asClass(PrismaOrdersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  ordersProductsRepository: asClass(PrismaOrderProductsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  hasher: asClass(BcrypterHasher),
  encrypter: asFunction(() => new JwtEncrypter(JwtService)),
  mailer: asFunction(() => {
    const options = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
    };

    if (["prod", "homolog"].includes(env.ENV)) {
      Object.assign(options, {
        auth: {
          user: env.ECOO_EMAIL,
          pass: env.ECOO_EMAIL_PASSWORD,
        },
      });
    }

    const transporter = createTransport(options);

    return new Nodemailer(transporter);
  }),
  viewLoader: asFunction(() => new EjsLoader()),
  naturalLanguageProcessor: asClass(NlpService, {
    lifetime: "SINGLETON",
  }),
  paymentsProcessor: asFunction(() => {
    if (env.ENV === "prod") {
      return new Asaas();
    }
    return new FakePaymentsProcessor();
  }),
});
