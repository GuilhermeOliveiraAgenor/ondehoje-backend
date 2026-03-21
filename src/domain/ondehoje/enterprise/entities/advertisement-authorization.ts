import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AdvertisementAuthorizationProps {
  advertisementId: UniqueEntityID
  status: string
  decidedAt: Date
  decidedBy: UniqueEntityID
  rejectedReason?: string | null
}

export class AdvertisementAuthorization extends AggregateRoot<AdvertisementAuthorizationProps> {
  get advertisementId() {
    return this.props.advertisementId
  }

  set advertisementId(advertisementId: UniqueEntityID) {
    this.props.advertisementId = advertisementId
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
  }

  get decidedAt() {
    return this.props.decidedAt
  }

  set decidedAt(decidedAt: Date) {
    this.props.decidedAt = decidedAt
  }

  get decidedBy() {
    return this.props.decidedBy
  }

  set decidedBy(decidedBy: UniqueEntityID) {
    this.props.decidedBy = decidedBy
  }

  get rejectedReason() {
    return this.props.rejectedReason
  }

  set rejectedReason(rejectedReason: string | null | undefined) {
    this.props.rejectedReason = rejectedReason
  }

  static create(
    props: Optional<
      AdvertisementAuthorizationProps,
      'decidedAt' | 'rejectedReason'
    >,
    id?: UniqueEntityID,
  ): AdvertisementAuthorization {
    const advertisementAuthorization = new AdvertisementAuthorization(
      {
        ...props,
        decidedAt: props.decidedAt ?? new Date(),
        rejectedReason: props.rejectedReason ?? null,
      },
      id,
    )

    return advertisementAuthorization
  }
}
