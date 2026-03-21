import { PermissionsRepository } from '@/domain/identity-access/application/repositories/permissions-repository'
import type { Permission } from '@/domain/identity-access/enterprise/entities/permission'

export class InMemoryPermissionsRepository implements PermissionsRepository {
  public items: Permission[] = []

  async findById(id: string): Promise<Permission | null> {
    const permission = this.items.find((item) => item.id.toString() === id)

    if (!permission) {
      return null
    }

    return permission
  }

  async findByActionAndEntity(
    action: string,
    entity: string,
  ): Promise<Permission | null> {
    const permission = this.items.find(
      (item) => item.action === action && item.entity === entity,
    )

    if (!permission) {
      return null
    }

    return permission
  }

  async create(permission: Permission): Promise<void> {
    this.items.push(permission)
  }
}
