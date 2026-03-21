import { Event as PrismaEvent, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        addressId: new UniqueEntityID(raw.addressId),
        categoryId: new UniqueEntityID(raw.categoryId),
        name: raw.name,
        slug: Slug.createFromText(raw.slug),
        description: raw.description,
        startDate: raw.startDate,
        endDate: raw.endDate,
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

  static toPersistency(raw: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId.toString(),
      addressId: raw.addressId.toString(),
      categoryId: raw.categoryId.toString(),
      name: raw.name,
      slug: raw.slug.value,
      description: raw.description,
      startDate: raw.startDate,
      endDate: raw.endDate,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy ? raw.deletedBy.toString() : null,
    }
  }
}
