import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { IdentityRoleList } from './identity-role-list'

export interface IdentityProps {
  roles: IdentityRoleList
}

export class Identity extends AggregateRoot<IdentityProps> {
  get roles() {
    return this.props.roles
  }

  set roles(roles: IdentityRoleList) {
    this.props.roles = roles
  }

  static create(props: Optional<IdentityProps, 'roles'>, id: UniqueEntityID) {
    const identity = new Identity(
      {
        ...props,
        roles: props.roles ?? new IdentityRoleList(),
      },
      id,
    )

    return identity
  }
}
