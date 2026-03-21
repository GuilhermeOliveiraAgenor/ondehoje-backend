import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface UserDetailsProps {
  id: UniqueEntityID
  name: string
  email: string
  password: string
  birthDate: Date
  provider: string
  image: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class UserDetails extends ValueObject<UserDetailsProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get birthDate() {
    return this.props.birthDate
  }

  get provider() {
    return this.props.provider
  }

  get image() {
    return this.props.image
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: UserDetailsProps) {
    return new UserDetails(props)
  }
}
