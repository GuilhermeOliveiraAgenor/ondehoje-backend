import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PermissionProps {
  action: string
  entity: string
}

export class Permission extends Entity<PermissionProps> {
  get action() {
    return this.props.action
  }

  get entity() {
    return this.props.entity
  }

  static create(props: PermissionProps, id?: UniqueEntityID) {
    const permission = new Permission(props, id)

    return permission
  }
}
