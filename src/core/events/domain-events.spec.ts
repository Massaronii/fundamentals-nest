import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateRootCreated implements DomainEvent {
  public ocurredAt: Date
    private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateRootCreated(aggregate))

    return aggregate
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // subscriber cadastrado (ouvindo o evento de resposta criado)
    DomainEvents.register(callbackSpy, CustomAggregateRootCreated.name)

    // estou criando uma resposta porem sem salvar o banco
    const aggregate = CustomAggregate.create()

    // estou assegurando que o evento foi criado porém nao foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // estou salvando a repota no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
