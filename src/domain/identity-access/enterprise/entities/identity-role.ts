import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface IdentityRoleProps {
  identityId: UniqueEntityID
  roleId: UniqueEntityID
}

export class IdentityRole extends Entity<IdentityRoleProps> {
  get identityId() {
    return this.props.identityId
  }

  set identityId(identityId: UniqueEntityID) {
    this.props.identityId = identityId
  }

  get roleId() {
    return this.props.roleId
  }

  set roleId(roleId: UniqueEntityID) {
    this.props.roleId = roleId
  }

  static create(props: IdentityRoleProps, id?: UniqueEntityID) {
    const identityRole = new IdentityRole(props, id)

    return identityRole
  }
}
