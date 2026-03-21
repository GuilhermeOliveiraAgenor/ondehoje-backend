import { UniqueEntityID } from '../entities/unique-entity-id'

/**
 * Contrato que especifica a estrutura de um evento de domínio
 * Ex: A resposta foi criada, comentário foi criado, etc.
 * Esses eventos eles vão ser classes que precisam assinar o contrato
 */

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}
