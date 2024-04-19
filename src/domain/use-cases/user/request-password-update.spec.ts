import { FakeMailer } from "test/mail/fake-mailer";
import { FakeViewLoader } from "test/mail/fake-view-loader";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { RequestPasswordUpdateUseCase } from "./request-password-update";
import { makeUser } from "test/factories/make-user";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeMailer: FakeMailer;
let fakeEncrypter: FakeEncrypter;
let fakeViewLoader: FakeViewLoader;
let sut: RequestPasswordUpdateUseCase;
let fakeMailerSpy: SpyInstance;

describe("request password update", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeMailer = new FakeMailer();
    fakeEncrypter = new FakeEncrypter();
    fakeViewLoader = new FakeViewLoader();

    sut = new RequestPasswordUpdateUseCase(
      inMemoryUsersRepository,
      fakeMailer,
      fakeEncrypter,
      fakeViewLoader
    );

    fakeMailerSpy = vi.spyOn(fakeMailer, "send");
  });

  it("should send a email when a password update request is made", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.save(user);

    await sut.execute({
      email: user.email,
    });

    await waitFor(() => {
      expect(fakeMailerSpy).toHaveBeenCalled();
    });
  });

  it("should not be able to execute for a user that do not exists", async () => {
    await expect(() =>
      sut.execute({
        email: "fake@fake.com",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
