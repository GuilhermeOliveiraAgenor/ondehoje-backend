import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

export abstract class SubscriptionsRepository {
  abstract findById(id: string): Promise<Subscription | null>
  abstract findByCompanyId(companyId: string): Promise<Subscription | null>
  abstract create(subscription: Subscription): Promise<void>
  abstract save(subscription: Subscription): Promise<void>
}
