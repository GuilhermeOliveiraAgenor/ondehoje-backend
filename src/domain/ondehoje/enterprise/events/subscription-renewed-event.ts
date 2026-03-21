import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Subscription } from '../entities/subscription'

export class SubscriptionRenewedEvent implements DomainEvent {
  public occurredAt: Date
  public subscription: Subscription

  constructor(subscription: Subscription) {
    this.subscription = subscription
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.subscription.id
  }
}
