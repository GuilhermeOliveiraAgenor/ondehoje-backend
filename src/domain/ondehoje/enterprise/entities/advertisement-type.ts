import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AdvertisementTypeProps {
  name: string
  description: string
  days: number
  value: number
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date
  updatedBy?: UniqueEntityID
}

export class AdvertisementType extends Entity<AdvertisementTypeProps> {
  isSuccess() {
    throw new Error('Method not implemented.')
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

  get days() {
    return this.props.days
  }

  set days(days: number) {
    this.props.days = days
    this.touch()
  }

  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
    this.touch()
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

  set createdBy(createdBy: UniqueEntityID) {
    this.props.createdBy = createdBy
    this.touch()
  }

  set updatedBy(updatedBy: UniqueEntityID | undefined) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AdvertisementTypeProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const advertisementType = new AdvertisementType(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
      },
      id,
    )

    return advertisementType
  }
}
