import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";
import { SearchOffersUseCase } from "@/domain/use-cases/search-offers";
import { SendEmailUseCase } from "@/domain/use-cases/send-email";
import { VerifyUseCase } from "@/domain/use-cases/verify";
import { diContainer } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";

diContainer.register({
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
  offerProductsUseCase: asFunction(
    ({
      agribusinessesRepository,
      offersRepository,
      offersProductsRepository,
      productsRepository,
    }) =>
      new OfferProductsUseCase(
        agribusinessesRepository,
        offersRepository,
        offersProductsRepository,
        productsRepository
      )
  ),
  searchOffersUseCase: asFunction(
    ({
      naturalLanguageProcessor,
      productsCollection,
      productsRepository,
      offersProductsRepository,
    }) =>
      new SearchOffersUseCase(
        naturalLanguageProcessor,
        productsCollection,
        productsRepository,
        offersProductsRepository
      )
  ),

  orderProductsUseCase: asFunction(
    ({
      productsRepository,
      offersProductsRepository,
      ordersRepository,
      ordersProductsRepository,
    }) =>
      new OrderProductsUseCase(
        productsRepository,
        offersProductsRepository,
        ordersRepository,
        ordersProductsRepository
      )
  ),
});
