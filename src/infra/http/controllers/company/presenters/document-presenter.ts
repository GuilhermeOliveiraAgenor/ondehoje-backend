import { Document } from '@/domain/ondehoje/enterprise/entities/document'

export class DocumentPresenter {
  static toHTTP(raw: Document) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      file: raw.file,
      description: raw.description,
      expiresAt: raw.expiresAt,
      documentTypeId: raw.documentTypeId.toString(),
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy?.toString() || null,
    }
  }
}
