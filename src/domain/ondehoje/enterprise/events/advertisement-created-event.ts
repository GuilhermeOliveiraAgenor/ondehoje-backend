import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Advertisement } from '../entities/advertisement'

export class AdvertisementCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public advertisement: Advertisement

  constructor(advertisement: Advertisement) {
    this.advertisement = advertisement
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.advertisement.id
  }
}
