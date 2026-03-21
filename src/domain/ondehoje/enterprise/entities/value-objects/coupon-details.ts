import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { EventDetails } from './event-details'

interface CouponDetailsProps {
  id: UniqueEntityID
  event: EventDetails
  name: string
  description: string
  expiresAt: Date
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  isRedeemed: boolean
}

export class CouponDetails extends ValueObject<CouponDetailsProps> {
  get id() {
    return this.props.id
  }

  get event() {
    return this.props.event
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get expiresAt() {
    return this.props.expiresAt
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

  get isRedeemed() {
    return this.props.isRedeemed
  }

  static create(props: CouponDetailsProps) {
    const couponDetails = new CouponDetails(props)

    return couponDetails
  }
}
