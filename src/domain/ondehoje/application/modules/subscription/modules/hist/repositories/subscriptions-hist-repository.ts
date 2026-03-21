import type { SubscriptionHist } from '@/domain/ondehoje/enterprise/entities/subscription-hist'

export abstract class SubscriptionsHistRepository {
  abstract findById(id: string): Promise<SubscriptionHist | null>
  abstract findManyByCompanyId(companyId: string): Promise<SubscriptionHist[]>
}
