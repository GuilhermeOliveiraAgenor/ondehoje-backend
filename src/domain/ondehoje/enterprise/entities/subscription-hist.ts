import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SubscriptionHistProps {
  companyId: UniqueEntityID
  startDate: Date
  endDate: Date
  status: string
  amount: number
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt: Date
  updatedBy: UniqueEntityID
  deletedAt: Date
  deletedBy: UniqueEntityID
}

export class SubscriptionHist extends Entity<SubscriptionHistProps> {
  get companyId() {
    return this.props.companyId
  }

  get startDate() {
    return this.props.startDate
  }

  get endDate() {
    return this.props.endDate
  }

  get status() {
    return this.props.status
  }

  get amount() {
    return this.props.amount
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

  static create(props: SubscriptionHistProps, id?: UniqueEntityID) {
    const subscriptionHist = new SubscriptionHist(props, id)

    return subscriptionHist
  }
}
