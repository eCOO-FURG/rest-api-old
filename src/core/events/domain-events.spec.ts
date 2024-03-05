import { DomainEvent } from "../events/domain-event";
import { Entity } from "../entities/entity";
import { vi } from "vitest";
import { UUID } from "../entities/uuid";
import { DomainEvents } from "./domain-events";

class CustomEntityCreated implements DomainEvent {
  public ocurred_at: Date;
  private entity: CustomEntity;

  constructor(entity: CustomEntity) {
    this.entity = entity;
    this.ocurred_at = new Date();
  }

  public getEntityId(): UUID {
    return this.entity.id;
  }
}

class CustomEntity extends Entity<any> {
  static create() {
    const aggregate = new CustomEntity({});

    aggregate.registerEvent(new CustomEntityCreated(aggregate));

    return aggregate;
  }
}

describe("domain events", () => {
  it("should be able to dispatch and listen to events", async () => {
    const callbackSpy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomEntityCreated.name);

    // Estou criando uma resposta porém SEM salvar no banco
    const entity = CustomEntity.create();

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(entity.events).toHaveLength(1);

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForEntity(entity.id);

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();

    expect(entity.events).toHaveLength(0);
  });
});
