import { Prisma, Subscription as PrismaSubscription } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

export class PrismaSubscriptionMapper {
  static toDomain(raw: PrismaSubscription): Subscription {
    return Subscription.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        startDate: raw.startDate,
        endDate: raw.endDate,
        status: raw.status,
        amount: raw.amount,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: new UniqueEntityID(raw.updatedBy),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: Subscription,
  ): Prisma.SubscriptionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId.toString(),
      startDate: raw.startDate,
      endDate: raw.endDate,
      status: raw.status,
      amount: raw.amount,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy.toString(),
    }
  }
}
