import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DocumentType,
  DocumentTypeProps,
} from '@/domain/ondehoje/enterprise/entities/document-type'
import { PrismaDocumentTypeMapper } from '@/infra/database/prisma/mappers/prisma-document-type-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeDocumentType(
  override: Partial<DocumentType> = {}, // completa campos
  id?: UniqueEntityID, // cria id
) {
  const company = DocumentType.create(
    {
      name: faker.person.fullName(), // campos
      description: faker.finance.currencyName(),
      createdBy: new UniqueEntityID(),
      ...override, // escreve os outros campos
    },
    id,
  )

  return company
}

@Injectable()
export class DocumentTypeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDocumentType(
    data: Partial<DocumentTypeProps> = {},
  ): Promise<DocumentType> {
    const documentType = makeDocumentType(data)

    await this.prisma.documentType.create({
      data: PrismaDocumentTypeMapper.toPersistency(documentType),
    })

    return documentType
  }
}
