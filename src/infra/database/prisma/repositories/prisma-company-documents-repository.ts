import { Injectable } from '@nestjs/common'

import { CompanyDocumentsRepository } from '@/domain/ondehoje/application/modules/company-document/repositories/company-documents-repository'
import { CompanyDocument } from '@/domain/ondehoje/enterprise/entities/company-document'

import { PrismaCompanyDocumentMapper } from '../mappers/prisma-company-document-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCompanyDocumentsRepository
  implements CompanyDocumentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByCompanyId(companyId: string): Promise<CompanyDocument[]> {
    const [companyDocuments] = await this.prisma.$transaction([
      this.prisma.companyDocument.findMany({
        where: {
          companyId,
        },
      }),
    ])

    return companyDocuments.map(PrismaCompanyDocumentMapper.toDomain)
  }

  async createMany(documents: CompanyDocument[]): Promise<void> {
    if (documents.length === 0) {
      return
    }

    const data = PrismaCompanyDocumentMapper.toPersistencyMany(documents)

    await this.prisma.$transaction([
      this.prisma.companyDocument.createMany(data),
    ])
  }

  async deleteMany(documents: CompanyDocument[]): Promise<void> {
    if (documents.length === 0) {
      return
    }

    const companyDocumentsToDelete = documents.map((companyImage) => {
      return {
        companyId: companyImage.companyId.toString(),
        documentId: companyImage.documentId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.companyImage.deleteMany({
        where: {
          OR: companyDocumentsToDelete,
        },
      }),
    ])
  }

  async deleteManyByCompanyId(companyId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.companyDocument.deleteMany({
        where: {
          companyId,
        },
      }),
    ])
  }
}
