import {
  Prisma,
  SubscriptionHist as PrismaSubscriptionHist,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubscriptionHist } from '@/domain/ondehoje/enterprise/entities/subscription-hist'

export class PrismaSubscriptionHistMapper {
  static toDomain(raw: PrismaSubscriptionHist): SubscriptionHist {
    return SubscriptionHist.create(
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
        deletedAt: raw.deletedAt,
        deletedBy: new UniqueEntityID(raw.deletedBy),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: SubscriptionHist,
  ): Prisma.SubscriptionHistUncheckedCreateInput {
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
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy.toString(),
    }
  }
}
