import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { SubscriptionStatus } from '../../application/modules/subscription/enum/subscription-status'
import { SubscriptionRenewedEvent } from '../events/subscription-renewed-event'

export interface SubscriptionProps {
  companyId: UniqueEntityID
  startDate: Date
  endDate: Date
  status: string
  amount: number
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt: Date
  updatedBy: UniqueEntityID
}

export class Subscription extends AggregateRoot<SubscriptionProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId
    this.touch()
  }

  get startDate() {
    return this.props.startDate
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate
    this.touch()
  }

  get endDate() {
    return this.props.endDate
  }

  set endDate(endDate: Date) {
    this.props.endDate = endDate
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    if (status === SubscriptionStatus.PENDING) {
      // Subscription has been changed, perform necessary actions
      this.addDomainEvent(new SubscriptionRenewedEvent(this))
    }

    this.props.status = status
    this.touch()
  }

  get amount() {
    return this.props.amount
  }

  set amount(amount: number) {
    this.props.amount = amount
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get createdBy() {
    return this.props.createdBy
  }

  set createdBy(createdBy: UniqueEntityID) {
    this.props.createdBy = createdBy
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  set updatedBy(updatedBy: UniqueEntityID) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<SubscriptionProps, 'createdAt' | 'updatedAt' | 'updatedBy'>,
    id?: UniqueEntityID,
  ) {
    const subscription = new Subscription(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        updatedBy: props.updatedBy ?? props.createdBy,
      },
      id,
    )

    return subscription
  }
}
