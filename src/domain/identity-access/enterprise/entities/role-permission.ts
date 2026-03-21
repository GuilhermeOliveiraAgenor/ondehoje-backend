import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RolePermissionProps {
  roleId: UniqueEntityID
  permissionId: UniqueEntityID
}

export class RolePermission extends Entity<RolePermissionProps> {
  get roleId() {
    return this.props.roleId
  }

  set roleId(roleId: UniqueEntityID) {
    this.props.roleId = roleId
  }

  get permissionId() {
    return this.props.permissionId
  }

  set permissionId(permissionId: UniqueEntityID) {
    this.props.permissionId = permissionId
  }

  static create(props: RolePermissionProps, id?: UniqueEntityID) {
    const rolePermission = new RolePermission(props, id)

    return rolePermission
  }
}
