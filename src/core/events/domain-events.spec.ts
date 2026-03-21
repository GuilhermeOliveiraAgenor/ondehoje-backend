import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// Quando algo foi criado eu tenho uma classe que identifica esse evento
class CustomAggregateCreate implements DomainEvent {
  occurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date()
    this.aggregate = aggregate
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  // Quando algo for criado (resposta, pergunta)
  static create() {
    const aggregate = new CustomAggregate(null)

    // Adicione um domainEvent na minha lista de eventos que ocorreram passando a classe que identifica o evento
    aggregate.addDomainEvent(new CustomAggregateCreate(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreate.name)

    // Estou criando uma resposta porém SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
