import {
  CompanyDocument as PrismaCompanyDocument,
  Prisma,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyDocument } from '@/domain/ondehoje/enterprise/entities/company-document'

export class PrismaCompanyDocumentMapper {
  static toDomain(raw: PrismaCompanyDocument): CompanyDocument {
    return CompanyDocument.create({
      companyId: new UniqueEntityID(raw.companyId),
      documentId: new UniqueEntityID(raw.documentId),
    })
  }

  static toPersistencyMany(
    raw: CompanyDocument[],
  ): Prisma.CompanyDocumentCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        companyId: raw.companyId.toString(),
        documentId: raw.documentId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
