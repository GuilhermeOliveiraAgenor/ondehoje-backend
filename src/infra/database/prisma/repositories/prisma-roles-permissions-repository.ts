import { Injectable } from '@nestjs/common'

import { RolesPermissionsRepository } from '@/domain/identity-access/application/repositories/roles-permissions-repository'
import { RolePermission } from '@/domain/identity-access/enterprise/entities/role-permission'

import { PrismaRolePermissionMapper } from '../mappers/prisma-role-permission-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRolesPermissionsRepository
  implements RolesPermissionsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(relations: RolePermission[]): Promise<void> {
    if (relations.length === 0) {
      return
    }

    const data = PrismaRolePermissionMapper.toPersistencyMany(relations)

    await this.prisma.$transaction([
      this.prisma.rolePermission.createMany(data),
    ])
  }

  async deleteMany(relations: RolePermission[]): Promise<void> {
    if (relations.length === 0) {
      return
    }

    const rolesPermissionsToDelete = relations.map((raw) => {
      return {
        roleId: raw.roleId.toString(),
        permissionId: raw.permissionId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.identityRole.deleteMany({
        where: {
          OR: rolesPermissionsToDelete,
        },
      }),
    ])
  }
}
