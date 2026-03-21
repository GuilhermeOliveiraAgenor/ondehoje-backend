import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

export abstract class DocumentTypesRepository {
  abstract findById(id: string): Promise<DocumentType | null>
  abstract findByName(name: string): Promise<DocumentType | null>
  abstract findMany(): Promise<DocumentType[]>
  abstract create(documentType: DocumentType): Promise<void>
  abstract save(documentType: DocumentType): Promise<void>
}
