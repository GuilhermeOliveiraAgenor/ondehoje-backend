import { DocumentTypesRepository } from '@/domain/ondehoje/application/modules/document-type/repositories/document-types-repository'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

export class InMemoryDocumentTypesRepository
  implements DocumentTypesRepository
{
  public items: DocumentType[] = []

  async findById(id: string): Promise<DocumentType | null> {
    const documentType = this.items.find((item) => item.id.toString() === id)

    if (!documentType) {
      return null
    }

    return documentType
  }

  async findByName(name: string): Promise<DocumentType | null> {
    const documentType = this.items.find((item) => item.name === name)

    if (!documentType) {
      return null
    }

    return documentType
  }

  async findMany(): Promise<DocumentType[]> {
    return this.items
  }

  async create(documentType: DocumentType): Promise<void> {
    this.items.push(documentType)
  }

  async save(documentType: DocumentType): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === documentType.id,
    )

    this.items[itemIndex] = documentType
  }
}
