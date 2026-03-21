import { RolesRepository } from '@/domain/identity-access/application/repositories/roles-repository'
import type { Role } from '@/domain/identity-access/enterprise/entities/role'

import type { InMemoryRolesPermissionsRepository } from './in-memory-roles-permissions-repository'

export class InMemoryRolesRepository implements RolesRepository {
  public items: Role[] = []

  constructor(
    private rolesPermissionsRepository: InMemoryRolesPermissionsRepository,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const role = this.items.find((role) => role.id.toString() === id)

    if (!role) {
      return null
    }

    return role
  }

  async findByName(name: string): Promise<Role | null> {
    const role = this.items.find((role) => role.name === name)

    if (!role) {
      return null
    }

    return role
  }

  async create(role: Role): Promise<void> {
    this.items.push(role)

    await this.rolesPermissionsRepository.createMany(
      role.permissions.getNewItems(),
    )
  }

  async save(role: Role): Promise<void> {
    const index = this.items.findIndex((item) => item.id === role.id)

    this.items[index] = role

    await this.rolesPermissionsRepository.createMany(
      role.permissions.getNewItems(),
    )
    await this.rolesPermissionsRepository.deleteMany(
      role.permissions.getRemovedItems(),
    )
  }
}
