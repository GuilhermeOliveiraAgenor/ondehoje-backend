import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface InformationProps {
  companyId?: UniqueEntityID | null
  eventId?: UniqueEntityID | null
  name: string
  description?: string | null
  phoneNumber?: string | null
  email?: string | null
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  deletedAt?: Date | null
  deletedBy?: UniqueEntityID | null
}

export class Information extends Entity<InformationProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID | null | undefined) {
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

  set description(description: string | null | undefined) {
    this.props.description = description
    this.touch()
  }

  get phoneNumber() {
    return this.props.phoneNumber
  }

  set phoneNumber(phoneNumber: string | null | undefined) {
    this.props.phoneNumber = phoneNumber
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string | null | undefined) {
    this.props.email = email
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
      InformationProps,
      | 'description'
      | 'phoneNumber'
      | 'email'
      | 'createdAt'
      | 'updatedAt'
      | 'updatedBy'
      | 'deletedAt'
      | 'deletedBy'
    >,
    id?: UniqueEntityID,
  ) {
    const information = new Information(
      {
        ...props,
        description: props.description ?? null,
        phoneNumber: props.phoneNumber ?? null,
        email: props.email ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
        updatedBy: props.updatedBy ?? null,
        deletedAt: props.deletedAt ?? null,
        deletedBy: props.deletedBy ?? null,
      },
      id,
    )

    return information
  }
}
