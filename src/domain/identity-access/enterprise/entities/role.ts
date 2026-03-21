import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { RolePermissionList } from './role-permission-list'

export interface RoleProps {
  name: string
  permissions: RolePermissionList
}

export class Role extends Entity<RoleProps> {
  get name() {
    return this.props.name
  }

  get permissions() {
    return this.props.permissions
  }

  static create(
    props: Optional<RoleProps, 'permissions'>,
    id?: UniqueEntityID,
  ) {
    const role = new Role(
      {
        ...props,
        permissions: props.permissions ?? new RolePermissionList(),
      },
      id,
    )

    return role
  }
}
