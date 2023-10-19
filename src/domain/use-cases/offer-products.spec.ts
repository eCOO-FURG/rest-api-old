import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { OfferProductsUseCase } from "./offer-products";
import { Agribusiness } from "../entities/agribusiness";
import { InMemoryOffersRepository } from "test/repositories/in-memory-offers-repository";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { Offer } from "../entities/offer";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryOffersRepository: InMemoryOffersRepository;
let inMemoryAgribusinessesRepostory: InMemoryAgribusinessesRepository;
let sut: OfferProductsUseCase;

describe("offer product", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryOffersRepository = new InMemoryOffersRepository();
    inMemoryAgribusinessesRepostory = new InMemoryAgribusinessesRepository();
    sut = new OfferProductsUseCase(
      inMemoryAccountsRepository,
      inMemoryAgribusinessesRepostory,
      inMemoryOffersRepository
    );
  });

  it("should be able to offer products", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    const agribussines = Agribusiness.create({
      admin_id: account.id,
      caf: "123456",
      name: "fake name",
    });

    inMemoryAgribusinessesRepostory.save(agribussines);

    await sut.execute({
      agribusiness_id: agribussines.id.toString(),
      account_id: account.id.toString(),
    });

    expect(inMemoryOffersRepository.items[0]).toBeInstanceOf(Offer);
    expect(inMemoryOffersRepository.items[0].status).toBe("PENDING");
  });
});
