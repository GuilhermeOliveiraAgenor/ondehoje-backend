import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'
import { SubscriptionHist } from '@/domain/ondehoje/enterprise/entities/subscription-hist'

export function makeSubscriptionHist(
  override: Partial<SubscriptionHist> = {},
  id?: UniqueEntityID,
) {
  const subscriptionHist = SubscriptionHist.create(
    {
      companyId: new UniqueEntityID(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      status: SubscriptionStatus.PENDING,
      createdBy: new UniqueEntityID(),
      createdAt: faker.date.past(),
      deletedAt: new Date(),
      deletedBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return subscriptionHist
}
