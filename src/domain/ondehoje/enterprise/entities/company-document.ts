import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CompanyDocumentProps {
  companyId: UniqueEntityID
  documentId: UniqueEntityID
}

export class CompanyDocument extends Entity<CompanyDocumentProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId
  }

  get documentId() {
    return this.props.documentId
  }

  set documentId(documentId: UniqueEntityID) {
    this.props.documentId = documentId
  }

  static create(props: CompanyDocumentProps) {
    const companyDocument = new CompanyDocument(props)

    return companyDocument
  }
}
