import { DocumentType as PrismaDocumentType, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

export class PrismaDocumentTypeMapper {
  static toDomain(raw: PrismaDocumentType): DocumentType {
    return DocumentType.create(
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

  static toPersistency(
    raw: DocumentType,
  ): Prisma.DocumentTypeUncheckedCreateInput {
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
