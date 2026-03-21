import { DocumentsRepository } from '@/domain/ondehoje/application/modules/document/repositories/documents-repository'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'

export class InMemoryDocumentsRepository implements DocumentsRepository {
  public items: Document[] = []

  async createMany(documents: Document[]): Promise<void> {
    this.items.push(...documents)
  }
}
