import { Advertisement as PrismaAdvertisement, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'

export class PrismaAdvertisementMapper {
  static toDomain(raw: PrismaAdvertisement): Advertisement {
    return Advertisement.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        eventId: raw.eventId ? new UniqueEntityID(raw.eventId) : null,
        description: raw.description,
        days: raw.days,
        amount: raw.amount,
        clicks: raw.clicks,
        insights: raw.insights,
        status: raw.status,
        expirationDate: raw.expirationDate,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
        deletedAt: raw.deletedAt,
        deletedBy: raw.deletedBy ? new UniqueEntityID(raw.deletedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: Advertisement,
  ): Prisma.AdvertisementUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId.toString(),
      eventId: raw.eventId ? raw.eventId.toString() : null,
      description: raw.description,
      days: raw.days,
      amount: raw.amount,
      clicks: raw.clicks,
      insights: raw.insights,
      status: raw.status,
      expirationDate: raw.expirationDate,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy ? raw.deletedBy.toString() : null,
    }
  }
}
