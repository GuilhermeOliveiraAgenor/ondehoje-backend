import { WatchedList } from '@/core/entities/watched-list'

import { CompanyDocument } from './company-document'

export class CompanyDocumentList extends WatchedList<CompanyDocument> {
  compareItems(a: CompanyDocument, b: CompanyDocument): boolean {
    return a.companyId.equals(b.companyId) && a.documentId.equals(b.documentId)
  }
}
