import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { RegisterSessionUseCase } from "./register-session";
import { Session } from "../../entities/session";

let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let sut: RegisterSessionUseCase;

describe("register session", () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new RegisterSessionUseCase(inMemorySessionsRepository, fakeEncrypter);
  });

  it("should be able to register a session", async () => {
    const result = await sut.execute({
      user_id: "test-id",
      ip_address: "test-ip-address",
      user_agent: "test-user-agent",
    });

    expect(inMemorySessionsRepository.items[0]).toBeInstanceOf(Session);
    expect(result.token).toBeTypeOf("string");
  });
});
