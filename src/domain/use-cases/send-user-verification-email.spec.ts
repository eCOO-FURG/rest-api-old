import { FakeMailer } from "test/mail/fake-mailer";
import { SendUserVerificationEmailUseCase } from "./send-user-verification-email";
import { Account } from "../entities/account";
import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";

let fakeMailer: FakeMailer;
let sut: SendUserVerificationEmailUseCase;

describe("send user verification email", () => {
  beforeEach(() => {
    fakeMailer = new FakeMailer();
    sut = new SendUserVerificationEmailUseCase(fakeMailer);
  });

  it("should be able to send a user verification email", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    const person = Person.create({
      first_name: "John",
      last_name: "Doe",
      cpf: Cpf.createFromText("523.065.281-01"),
      account_id: account.id,
    });

    const result = await sut.execute({
      account,
      person,
    });

    expect(result).toBeUndefined();
  });
});
