import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { AdvertisementStatus } from '../../application/modules/advertisement/enums/advertisement-status'
import { AdvertisementChangedEvent } from '../events/advertisement-changed-event'
import { AdvertisementCreatedEvent } from '../events/advertisement-created-event'

export interface AdvertisementProps {
  companyId: UniqueEntityID
  eventId?: UniqueEntityID | null
  description: string
  days: number
  amount: number
  clicks: number
  insights: number
  status: string
  expirationDate: Date
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  deletedAt?: Date | null
  deletedBy?: UniqueEntityID | null
}

export class Advertisement extends AggregateRoot<AdvertisementProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId
    this.touch()
  }

  get eventId() {
    return this.props.eventId
  }

  set eventId(eventId: UniqueEntityID | null | undefined) {
    this.props.eventId = eventId
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get days() {
    return this.props.days
  }

  set days(days: number) {
    this.props.days = days
    this.touch()
  }

  get amount() {
    return this.props.amount
  }

  set amount(amount: number) {
    this.props.amount = amount
    this.touch()
  }

  get clicks() {
    return this.props.clicks
  }

  set clicks(clicks: number) {
    this.props.clicks = clicks
    this.touch()
  }

  get insights() {
    return this.props.insights
  }

  set insights(insights: number) {
    this.props.insights = insights
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.addDomainEvent(new AdvertisementChangedEvent(this))

    this.props.status = status
    this.touch()
  }

  get expirationDate() {
    return this.props.expirationDate
  }

  set expirationDate(expirationDate: Date) {
    this.props.expirationDate = expirationDate
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
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  set updatedBy(updatedBy: UniqueEntityID | null | undefined) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  set deletedAt(deletedAt: Date | null | undefined) {
    this.props.deletedAt = deletedAt
    this.touch()
  }

  get deletedBy() {
    return this.props.deletedBy
  }

  set deletedBy(deletedBy: UniqueEntityID | null | undefined) {
    this.props.deletedBy = deletedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      AdvertisementProps,
      | 'eventId'
      | 'clicks'
      | 'insights'
      | 'status'
      | 'createdAt'
      | 'deletedAt'
      | 'deletedBy'
    >,
    id?: UniqueEntityID,
  ) {
    const advertisement = new Advertisement(
      {
        ...props,
        eventId: props.eventId ?? null,
        clicks: props.clicks ?? 0,
        insights: props.insights ?? 0,
        status: props.status ?? AdvertisementStatus.WAITING_AUTHORIZATION,
        createdAt: props.createdAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
        deletedBy: props.deletedBy ?? null,
      },
      id,
    )

    const isNewAdvertisement = !id

    if (isNewAdvertisement) {
      advertisement.addDomainEvent(new AdvertisementCreatedEvent(advertisement))
    }

    return advertisement
  }
}
