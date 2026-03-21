import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CupomProps {
  eventId: UniqueEntityID
  name: string
  description: string
  expiresAt: Date
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  deletedAt?: Date | null
  deletedBy?: UniqueEntityID | null
}

export class Coupon extends Entity<CupomProps> {
  get eventId() {
    return this.props.eventId
  }

  set eventId(eventId: UniqueEntityID) {
    this.props.eventId = eventId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  set expiresAt(expiresAt: Date) {
    this.props.expiresAt = expiresAt
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

  set updatedBy(updatedBy: UniqueEntityID | undefined | null) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  get deletedBy() {
    return this.props.deletedBy
  }

  set deletedBy(deletedBy: UniqueEntityID | undefined | null) {
    this.props.deletedBy = deletedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      CupomProps,
      'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'
    >,
    id?: UniqueEntityID,
  ) {
    const coupon = new Coupon(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        updatedBy: props.updatedBy ?? null,
        deletedAt: props.deletedAt ?? null,
        deletedBy: props.deletedBy ?? null,
      },
      id,
    )

    return coupon
  }
}
