import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CompanyDocument,
  CompanyDocumentProps,
} from '@/domain/ondehoje/enterprise/entities/company-document'
import { PrismaCompanyDocumentMapper } from '@/infra/database/prisma/mappers/prisma-company-document-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCompanyDocument(
  override: Partial<CompanyDocument> = {},
  id?: UniqueEntityID,
) {
  const companyDocument = CompanyDocument.create(
    {
      companyId: new UniqueEntityID(),
      documentTypeId: new UniqueEntityID(),
      file: 'document.pdf',
      expiresAt: null,
      createdAt: new Date(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return companyDocument
}

@Injectable()
export class CompanyDocumentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompanyDocument(
    data: Partial<CompanyDocumentProps> = {},
  ): Promise<CompanyDocument> {
    const companyDocument = makeCompanyDocument(data)

    await this.prisma.companyDocument.create({
      data: PrismaCompanyDocumentMapper.toPersistency(companyDocument),
    })

    return companyDocument
  }
}
