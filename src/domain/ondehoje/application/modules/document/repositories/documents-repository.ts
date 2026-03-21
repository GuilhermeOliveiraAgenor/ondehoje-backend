import { Document } from '@/domain/ondehoje/enterprise/entities/document'

export abstract class DocumentsRepository {
  abstract createMany(documents: Document[]): Promise<void>
}
