import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { UserImageList } from './user-image-list'

export interface UserProps {
  name: string
  email: string
  password: string
  birthDate: Date
  provider: string
  images: UserImageList
  createdAt: Date
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get birthDate() {
    return this.props.birthDate
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate
    this.touch()
  }

  get provider() {
    return this.props.provider
  }

  set provider(provider: string) {
    this.props.provider = provider
    this.touch()
  }

  get images() {
    return this.props.images
  }

  set images(images: UserImageList) {
    this.props.images = images
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<UserProps, 'images' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        images: props.images ?? new UserImageList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
