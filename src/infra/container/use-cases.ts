import { AuthenticateWithOneTimePasswordUseCase } from "@/domain/use-cases/authenticate-with-one-time-password";
import { AuthenticateWithPasswordUseCase } from "@/domain/use-cases/authenticate-with-password";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";
import { RegisterOneTimePasswordUseCase } from "@/domain/use-cases/register-one-time-password";
import { RegisterSessionUseCase } from "@/domain/use-cases/register-session";
import { SearchOffersUseCase } from "@/domain/use-cases/search-offers";
import { UpdateAgribusinessUseCase } from "@/domain/use-cases/update-agribusiness";
import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/update-agribusiness-status";
import { VerifyUseCase } from "@/domain/use-cases/verify";
import { diContainer } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";

diContainer.register({
  registerUseCase: asFunction(
    ({ usersRepository, hasher }) =>
      new RegisterUseCase(usersRepository, hasher),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  registerSessionUseCase: asFunction(
    ({ sessionsRepository, encrypter }) =>
      new RegisterSessionUseCase(sessionsRepository, encrypter)
  ),
  authenticateWithPasswordUseCase: asFunction(
    ({ usersRepository, hasher, registerSessionUseCase }) =>
      new AuthenticateWithPasswordUseCase(
        usersRepository,
        hasher,
        registerSessionUseCase
      )
  ),
  authenticateWithOneTimePasswordUseCase: asFunction(
    ({
      accountsRepository,
      oneTimePasswordsRepository,
      registerSessionUseCase,
    }) =>
      new AuthenticateWithOneTimePasswordUseCase(
        accountsRepository,
        oneTimePasswordsRepository,
        registerSessionUseCase
      )
  ),
  getUserProfileUseCase: asFunction(
    ({ usersRepository }) => new GetUserProfileUseCase(usersRepository)
  ),
  refreshUseCase: asFunction(
    ({ accountsRepository, sessionsRepository, encrypter }) =>
      new RefreshUseCase(accountsRepository, sessionsRepository, encrypter)
  ),
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
    ({ agribusinessesRepository, offersRepository, productsRepository }) =>
      new OfferProductsUseCase(
        agribusinessesRepository,
        offersRepository,
        productsRepository
      )
  ),
  searchOffersUseCase: asFunction(
    ({
      naturalLanguageProcessor,
      productsRepository,
      offersProductsRepository,
    }) =>
      new SearchOffersUseCase(
        naturalLanguageProcessor,
        productsRepository,
        offersProductsRepository
      )
  ),
  orderProductsUseCase: asFunction(
    ({
      usersRepository,
      productsRepository,
      offersProductsRepository,
      ordersRepository,
    }) =>
      new OrderProductsUseCase(
        usersRepository,
        productsRepository,
        offersProductsRepository,
        ordersRepository
      )
  ),
  updateAgribusinessUseCase: asFunction(
    ({ agribusinessesRepository }) =>
      new UpdateAgribusinessUseCase(agribusinessesRepository),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  updateAgribusinessStatusUseCase: asFunction(
    ({ agribusinessesRepository }) =>
      new UpdateAgribusinessStatusUseCase(agribusinessesRepository),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  registerOneTimePasswordUseCase: asFunction(
    ({ accountsRepository, otpGenerator, oneTimePasswordsRepository }) =>
      new RegisterOneTimePasswordUseCase(
        accountsRepository,
        otpGenerator,
        oneTimePasswordsRepository
      )
  ),
});
