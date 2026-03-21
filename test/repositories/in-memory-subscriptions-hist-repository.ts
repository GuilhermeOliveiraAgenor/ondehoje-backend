import type { SubscriptionsHistRepository } from '@/domain/ondehoje/application/modules/subscription/modules/hist/repositories/subscriptions-hist-repository'
import type { SubscriptionHist } from '@/domain/ondehoje/enterprise/entities/subscription-hist'

export class InMemorySubscriptionsHistRepository
  implements SubscriptionsHistRepository
{
  public items: SubscriptionHist[] = []

  async findById(id: string): Promise<SubscriptionHist | null> {
    const subscriptionHist = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!subscriptionHist) {
      return null
    }

    return subscriptionHist
  }

  async findManyByCompanyId(companyId: string): Promise<SubscriptionHist[]> {
    const subscriptionsHist = this.items.filter(
      (subscriptionHist) => subscriptionHist.companyId.toString() === companyId,
    )

    return subscriptionsHist
  }
}
