import {
  Permission as PrismaPermission,
  Prisma,
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/identity-access/enterprise/entities/role'
import { RolePermissionList } from '@/domain/identity-access/enterprise/entities/role-permission-list'

import { PrismaRolePermissionMapper } from './prisma-role-permission-mapper'

export type PrismaRoleWithPermissions = PrismaRole & {
  rolePermissions: (PrismaRolePermission & {
    permission: PrismaPermission
  })[]
}

export class PrismaRoleMapper {
  static toDomain(raw: PrismaRoleWithPermissions): Role {
    const domainPermissions = raw.rolePermissions.map((junction) => {
      return PrismaRolePermissionMapper.toDomain(junction)
    })

    return Role.create(
      {
        name: raw.name,
        permissions: new RolePermissionList(domainPermissions),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(role: Role): Prisma.RoleUncheckedCreateInput {
    return {
      id: role.id.toString(),
      name: role.name,
    }
  }
}
