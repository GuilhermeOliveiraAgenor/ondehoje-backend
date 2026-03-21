import { Information as PrismaInformation, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

export class PrismaInformationMapper {
  static toDomain(raw: PrismaInformation): Information {
    return Information.create(
      {
        companyId: raw.companyId ? new UniqueEntityID(raw.companyId) : null,
        eventId: raw.eventId ? new UniqueEntityID(raw.eventId) : null,
        name: raw.name,
        description: raw.description,
        phoneNumber: raw.phoneNumber,
        email: raw.email,
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
    raw: Information,
  ): Prisma.InformationUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId?.toString(),
      eventId: raw.eventId?.toString(),
      name: raw.name,
      description: raw.description,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy ? raw.deletedBy.toString() : null,
    }
  }
}
