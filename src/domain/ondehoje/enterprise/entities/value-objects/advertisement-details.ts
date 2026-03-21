import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { AdvertisementAuthorization } from '../advertisement-authorization'
import { Company } from '../company'
import { Event } from '../event'

export interface AdvertisementDetailsProps {
  id: UniqueEntityID
  company: Company
  event?: Event | null
  description: string
  days: number
  amount: number
  clicks: number
  insights: number
  status: string
  expirationDate: Date
  advertisementAuthorizations: AdvertisementAuthorization[]
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class AdvertisementDetails extends ValueObject<AdvertisementDetailsProps> {
  get id() {
    return this.props.id
  }

  get company() {
    return this.props.company
  }

  get event() {
    return this.props.event
  }

  get description() {
    return this.props.description
  }

  get days() {
    return this.props.days
  }

  get amount() {
    return this.props.amount
  }

  get clicks() {
    return this.props.clicks
  }

  get insights() {
    return this.props.insights
  }

  get status() {
    return this.props.status
  }

  get expirationDate() {
    return this.props.expirationDate
  }

  get advertisementAuthorizations() {
    return this.props.advertisementAuthorizations
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

  static create(props: AdvertisementDetailsProps) {
    return new AdvertisementDetails(props)
  }
}
