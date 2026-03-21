import { RolesPermissionsRepository } from '@/domain/identity-access/application/repositories/roles-permissions-repository'
import { RolePermission } from '@/domain/identity-access/enterprise/entities/role-permission'

export class InMemoryRolesPermissionsRepository
  implements RolesPermissionsRepository
{
  public items: RolePermission[] = []

  async createMany(relations: RolePermission[]): Promise<void> {
    this.items.push(...relations)
  }

  async deleteMany(relations: RolePermission[]): Promise<void> {
    const rolePermissions = this.items.filter((item) => {
      return !relations.some((rolePermission) => rolePermission.equals(item))
    })

    this.items = rolePermissions
  }
}
