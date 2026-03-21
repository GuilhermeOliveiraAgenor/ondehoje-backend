import { Injectable } from '@nestjs/common'

import { DocumentsRepository } from '@/domain/ondehoje/application/modules/document/repositories/documents-repository'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'

import { PrismaDocumentMapper } from '../mappers/prisma-document-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDocumentsRepository implements DocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(documents: Document[]): Promise<void> {
    if (documents.length === 0) {
      return
    }

    const data = PrismaDocumentMapper.toPersistencyMany(documents)

    await this.prisma.document.createMany(data)
  }
}
