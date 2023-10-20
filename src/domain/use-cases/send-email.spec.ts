import { FakeMailer } from "test/mail/fake-mailer";
import { SendEmailUseCase } from "./send-email";
import { Account } from "../entities/account";

let fakeMailer: FakeMailer;
let sut: SendEmailUseCase;

describe("send user verification email", () => {
  beforeEach(() => {
    fakeMailer = new FakeMailer();
    sut = new SendEmailUseCase(fakeMailer);
  });

  it("should be able to send a user verification email", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    const result = await sut.execute({
      to: account.email,
      from: "test@mail.com",
      subject: "fake-subject",
      view: "<h1>view</h1>",
    });

    expect(result).toBeUndefined();
  });
});
