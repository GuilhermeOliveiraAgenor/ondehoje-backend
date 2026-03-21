import { Injectable } from '@nestjs/common'

import { DocumentTypesRepository } from '@/domain/ondehoje/application/modules/document-type/repositories/document-types-repository'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

import { PrismaDocumentTypeMapper } from '../mappers/prisma-document-type-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDocumentTypesRepository implements DocumentTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DocumentType | null> {
    const [documentType] = await this.prisma.$transaction([
      this.prisma.documentType.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!documentType) {
      return null
    }

    return PrismaDocumentTypeMapper.toDomain(documentType)
  }

  async findByName(name: string): Promise<DocumentType | null> {
    const [documentType] = await this.prisma.$transaction([
      this.prisma.documentType.findUnique({
        where: {
          name,
        },
      }),
    ])

    if (!documentType) {
      return null
    }

    return PrismaDocumentTypeMapper.toDomain(documentType)
  }

  async findMany(): Promise<DocumentType[]> {
    const [documentTypes] = await this.prisma.$transaction([
      this.prisma.documentType.findMany(),
    ])

    return documentTypes.map(PrismaDocumentTypeMapper.toDomain)
  }

  async create(documentType: DocumentType): Promise<void> {
    const data = PrismaDocumentTypeMapper.toPersistency(documentType)

    await this.prisma.$transaction([
      this.prisma.documentType.create({
        data,
      }),
    ])
  }

  async save(documentType: DocumentType): Promise<void> {
    const data = PrismaDocumentTypeMapper.toPersistency(documentType)

    await this.prisma.$transaction([
      this.prisma.documentType.update({
        where: {
          id: documentType.id.toString(),
        },
        data,
      }),
    ])
  }
}
