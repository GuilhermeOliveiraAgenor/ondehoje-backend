import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'
import {
  Subscription,
  SubscriptionProps,
} from '@/domain/ondehoje/enterprise/entities/subscription'
import { PrismaSubscriptionMapper } from '@/infra/database/prisma/mappers/prisma-subscription-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeSubscription(
  override: Partial<Subscription> = {},
  id?: UniqueEntityID,
) {
  const subscription = Subscription.create(
    {
      companyId: new UniqueEntityID(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      status: SubscriptionStatus.PENDING,
      createdBy: new UniqueEntityID(),
      amount: faker.number.float(),
      ...override,
    },
    id,
  )

  return subscription
}

@Injectable()
export class SubscriptionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSubscription(
    data: Partial<SubscriptionProps> = {},
  ): Promise<Subscription> {
    const subscription = makeSubscription(data)

    await this.prisma.subscription.create({
      data: PrismaSubscriptionMapper.toPersistency(subscription),
    })

    return subscription
  }
}
