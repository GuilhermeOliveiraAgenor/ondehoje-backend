import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Address } from '../address'
import { Category } from '../category'
import { Image } from '../image'
import { Information } from '../information'
import { CompanyDetails } from './company-details'
import { Slug } from './slug'

interface EventDetailsProps {
  id: UniqueEntityID
  name: string
  slug: Slug
  description?: string | null
  startDate: Date
  endDate: Date
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  deletedAt?: Date | null
  deletedBy?: UniqueEntityID | null
  company: CompanyDetails
  address: Address
  category: Category
  informations: Array<Information>
  images: Array<Image>
  isFavorited: boolean
}

export class EventDetails extends ValueObject<EventDetailsProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get description() {
    return this.props.description
  }

  get startDate() {
    return this.props.startDate
  }

  get endDate() {
    return this.props.endDate
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

  get deletedAt() {
    return this.props.deletedAt
  }

  get deletedBy() {
    return this.props.deletedBy
  }

  get company() {
    return this.props.company
  }

  get address() {
    return this.props.address
  }

  get category() {
    return this.props.category
  }

  get informations() {
    return this.props.informations
  }

  get images() {
    return this.props.images
  }

  get isFavorited() {
    return this.props.isFavorited
  }

  static create(props: EventDetailsProps) {
    const eventDetails = new EventDetails(props)

    return eventDetails
  }
}
