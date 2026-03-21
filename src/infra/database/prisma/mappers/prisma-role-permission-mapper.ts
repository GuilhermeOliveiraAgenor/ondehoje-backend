import {
  type Prisma,
  RolePermission as PrismaRolePermission,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RolePermission } from '@/domain/identity-access/enterprise/entities/role-permission'

export class PrismaRolePermissionMapper {
  static toDomain(raw: PrismaRolePermission): RolePermission {
    return RolePermission.create({
      roleId: new UniqueEntityID(raw.roleId),
      permissionId: new UniqueEntityID(raw.permissionId),
    })
  }

  static toPersistencyMany(
    raw: RolePermission[],
  ): Prisma.RolePermissionCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        roleId: raw.roleId.toString(),
        permissionId: raw.permissionId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
