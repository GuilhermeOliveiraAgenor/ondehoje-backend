import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

export class DocumentTypePresenter {
  static toHTTP(raw: DocumentType) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      description: raw.description,
    }
  }
}
