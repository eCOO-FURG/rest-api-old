import { diContainer } from "@fastify/awilix";
import { Lifetime, asClass, asFunction } from "awilix";
import { PrismaSessionsRepository } from "../database/repositories/prisma-sessions-repository";
import { PrismaProductsRepository } from "../database/repositories/prisma-products-repository";
import { PrismaAgribusinessesRepository } from "../database/repositories/prisma-agribusinesses-repository";
import { PrismaOffersRepository } from "../database/repositories/prisma-offers-repository";
import { BcrypterHasher } from "../cryptography/bcrypt-hasher";
import { createTransport } from "nodemailer";
import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import { env } from "../env";
import { EjsLoader } from "../mail/ejs-loader";
import { Nodemailer } from "../mail/nodemailer";
import * as JwtService from "jsonwebtoken";
import { PrismaOrdersRepository } from "../database/repositories/prisma-orders-repository";
import { FakePaymentsProcessor } from "test/payments/fake-payment-processor";
import { OtpProvider } from "../cryptography/otp-generator";
import { PrismaOneTimePasswordsRepository } from "../database/repositories/prisma-one-time-passwords-repository";
import { PrismaUsersRepository } from "../database/repositories/prisma-users-repository";
import { PrismaCyclesRepository } from "../database/repositories/prisma-cycles-repository";

diContainer.register({
  usersRepository: asClass(PrismaUsersRepository, {
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
  ordersRepository: asClass(PrismaOrdersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  oneTimePasswordsRepository: asClass(PrismaOneTimePasswordsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  cyclesRepository: asClass(PrismaCyclesRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  hasher: asClass(BcrypterHasher),
  encrypter: asFunction(() => new JwtEncrypter(JwtService)),
  mailer: asFunction(() => {
    const options = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
    };

    if (["prod", "staging"].includes(env.ENV)) {
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
  paymentsProcessor: asFunction(() => {
    return new FakePaymentsProcessor();
  }),
  otpGenerator: asFunction(() => new OtpProvider()),
});
