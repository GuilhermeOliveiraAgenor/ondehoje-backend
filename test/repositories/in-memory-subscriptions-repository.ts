import { DomainEvents } from '@/core/events/domain-events'
import { SubscriptionsRepository } from '@/domain/ondehoje/application/modules/subscription/repositories/subscriptions-repository'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

export class InMemorySubscriptionsRepository
  implements SubscriptionsRepository
{
  public items: Subscription[] = []

  async findById(id: string): Promise<Subscription | null> {
    const subscription = this.items.find((item) => item.id.toString() === id)

    if (!subscription) {
      return null
    }

    return subscription
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const subscription = this.items.find(
      (item) => item.companyId.toString() === companyId,
    )

    if (!subscription) {
      return null
    }

    return subscription
  }

  async create(subscription: Subscription): Promise<void> {
    this.items.push(subscription)
  }

  async save(subscription: Subscription): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === subscription.id,
    )

    this.items[itemIndex] = subscription

    DomainEvents.dispatchEventsForAggregate(subscription.id)
  }
}
