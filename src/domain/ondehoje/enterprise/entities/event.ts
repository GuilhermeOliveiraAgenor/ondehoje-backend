import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { EventImageList } from './event-image-list'
import { Slug } from './value-objects/slug'

export interface EventProps {
  companyId: UniqueEntityID
  addressId: UniqueEntityID
  categoryId: UniqueEntityID
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
  images: EventImageList
}

export class Event extends Entity<EventProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId
    this.touch()
  }

  get addressId() {
    return this.props.addressId
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId
    this.touch()
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description
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

  get images() {
    return this.props.images
  }

  set images(images: EventImageList) {
    this.props.images = images
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      EventProps,
      'images' | 'slug' | 'createdAt' | 'deletedAt' | 'deletedBy'
    >,
    id?: UniqueEntityID,
  ) {
    const event = new Event(
      {
        ...props,
        images: props.images ?? new EventImageList(),
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
        deletedBy: props.deletedBy ?? null,
      },
      id,
    )

    return event
  }
}
