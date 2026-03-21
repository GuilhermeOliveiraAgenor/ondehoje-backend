import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface IdentityDetailsProps {
  id: UniqueEntityID
  name: string
  email: string
  birthDate: Date
  provider: string
  image: string | null
  createdAt: Date
  updatedAt?: Date | null
  roles: Set<string>
  permissions: Set<string>
}

export class IdentityDetails extends ValueObject<IdentityDetailsProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
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

  get roles() {
    return this.props.roles
  }

  get permissions() {
    return this.props.permissions
  }

  static create(props: IdentityDetailsProps) {
    return new IdentityDetails(props)
  }
}
