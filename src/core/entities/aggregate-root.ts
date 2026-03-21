import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvens: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvens
  }

  // Método para pré-disparar os eventos
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvens.push(domainEvent)
    // Adicionando o agregado dentro do array de markedAggregates
    DomainEvents.markAggregateForDispatch(this)
  }

  // Método para limpar os eventos, porque? pois depois de ser enviado, não fique algum resquício
  public clearEvents() {
    this._domainEvens = []
  }
}
