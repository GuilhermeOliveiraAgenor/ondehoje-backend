import { Category as PrismaCategory, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        description: raw.description,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
    }
  }
}
