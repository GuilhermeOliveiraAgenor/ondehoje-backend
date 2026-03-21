import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { Identity } from '@/domain/identity-access/enterprise/entities/identity'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

import { InMemoryIdentitiesRolesRepository } from './in-memory-identities-roles-repository'
import { InMemoryPermissionsRepository } from './in-memory-permissions-repository'
import { InMemoryRolesPermissionsRepository } from './in-memory-roles-permissions-repository'
import { InMemoryRolesRepository } from './in-memory-roles-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryIdentitiesRepository implements IdentitiesRepository {
  public items: Identity[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private rolesRepository: InMemoryRolesRepository,
    private permissionsRepository: InMemoryPermissionsRepository,
    private identitiesRolesRepository: InMemoryIdentitiesRolesRepository,
    private rolesPermissionsRepository: InMemoryRolesPermissionsRepository,
  ) {}

  async findById(id: string): Promise<Identity | null> {
    const identity = this.items.find((item) => item.id.toString() === id)

    if (!identity) {
      return null
    }

    return identity
  }

  async findIdentityDetailsById(id: string): Promise<IdentityDetails | null> {
    const user = await this.usersRepository.findDetailsById(id)

    if (!user) {
      return null
    }

    const rolesSet = new Set<string>()
    const permissionsSet = new Set<string>()

    // 2. Busca as relações Identity -> Role
    const identityRoleLinks = this.identitiesRolesRepository.items.filter(
      (ir) => ir.identityId.equals(user.id),
    )
    const roleIds = identityRoleLinks.map((ir) => ir.roleId)

    // 3. Busca as Roles
    const roles = this.rolesRepository.items.filter((r) =>
      roleIds.some((rid) => rid.equals(r.id)),
    )
    roles.forEach((r) => rolesSet.add(r.name))

    // 4. Busca as relações Role -> Permission
    const rolePermissionLinks = this.rolesPermissionsRepository.items.filter(
      (rp) => roleIds.some((rid) => rid.equals(rp.roleId)),
    )
    const permissionIds = rolePermissionLinks.map((rp) => rp.permissionId)

    // 5. Busca as Permissions
    const permissions = this.permissionsRepository.items.filter((p) =>
      permissionIds.some((pid) => pid.equals(p.id)),
    )
    permissions.forEach((p) => permissionsSet.add(`${p.action}:${p.entity}`))

    return IdentityDetails.create({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
      provider: user.provider,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: rolesSet,
      permissions: permissionsSet,
    })
  }

  async findManyWithPermission(
    action: string,
    entity: string,
  ): Promise<IdentityDetails[]> {
    const permission = await this.permissionsRepository.findByActionAndEntity(
      action,
      entity,
    )

    if (!permission) {
      return [] // Nenhuma permissão com esse nome, ninguém a possui
    }

    const roleIdsWithPerm = this.rolesPermissionsRepository.items
      .filter((rp) => rp.permissionId.equals(permission.id))
      .map((rp) => rp.roleId)

    const identityIdsWithRole = this.identitiesRolesRepository.items
      .filter((ir) => roleIdsWithPerm.some((rid) => rid.equals(ir.roleId)))
      .map((ir) => ir.identityId)

    const uniqueIdentityIds = [
      ...new Set(identityIdsWithRole.map((id) => id.toString())),
    ]

    const detailsPromises = uniqueIdentityIds.map((id) =>
      this.findIdentityDetailsById(id),
    )
    const detailsList = await Promise.all(detailsPromises)

    return detailsList.filter((d) => d !== null)
  }

  async create(identity: Identity): Promise<void> {
    this.items.push(identity)

    await this.identitiesRolesRepository.createMany(identity.roles.getItems())
  }

  async save(identity: Identity): Promise<void> {
    const index = this.items.findIndex((item) => item.id === identity.id)

    this.items[index] = identity

    await this.identitiesRolesRepository.createMany(
      identity.roles.getNewItems(),
    )
    await this.identitiesRolesRepository.deleteMany(
      identity.roles.getRemovedItems(),
    )
  }
}
