import { Document as PrismaDocument, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'

export class PrismaDocumentMapper {
  static toDomain(raw: PrismaDocument): Document {
    return Document.create(
      {
        documentTypeId: new UniqueEntityID(raw.documentTypeId),
        name: raw.name,
        description: raw.description,
        file: raw.file,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt ?? null,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistencyMany(raw: Document[]): Prisma.DocumentCreateManyArgs {
    return {
      data: raw.map((document) => ({
        id: document.id.toString(),
        documentTypeId: document.documentTypeId.toString(),
        name: document.name,
        description: document.description,
        file: document.file,
        expiresAt: document.expiresAt,
        createdAt: document.createdAt,
        createdBy: document.createdBy.toString(),
        updatedAt: document.updatedAt,
        updatedBy: document.updatedBy ? document.updatedBy.toString() : null,
      })),
    }
  }
}
