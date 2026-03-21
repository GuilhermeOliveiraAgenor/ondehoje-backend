import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Address } from '../address'
import { Document } from '../document'
import { Image } from '../image'
import { Information } from '../information'
import { Slug } from './slug'

interface CompanyDetailsProps {
  id: UniqueEntityID
  name: string
  slug: Slug
  socialName: string
  status: string
  document: string
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  address: Address
  documents: Document[]
  images: Image[]
  informations: Array<Information>
  isFavorited: boolean
}

export class CompanyDetails extends ValueObject<CompanyDetailsProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get socialName() {
    return this.props.socialName
  }

  get status() {
    return this.props.status
  }

  get document() {
    return this.props.document
  }

  get createdAt() {
    return this.props.createdAt
  }

  get createdBy() {
    return this.props.createdBy
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  get address() {
    return this.props.address
  }

  get documents() {
    return this.props.documents
  }

  get images() {
    return this.props.images
  }

  get informations() {
    return this.props.informations
  }

  get isFavorited() {
    return this.props.isFavorited
  }

  static create(props: CompanyDetailsProps) {
    const companyDetails = new CompanyDetails(props)

    return companyDetails
  }
}
