import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RolePermission } from '@/domain/identity-access/enterprise/entities/role-permission'

export function makeRolePermission(
  override: Partial<RolePermission> = {},
  id?: UniqueEntityID,
) {
  const rolePermission = RolePermission.create(
    {
      roleId: new UniqueEntityID(),
      permissionId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return rolePermission
}
