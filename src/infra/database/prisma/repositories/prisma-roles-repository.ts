import { Injectable } from '@nestjs/common'

import { RolesPermissionsRepository } from '@/domain/identity-access/application/repositories/roles-permissions-repository'
import { RolesRepository } from '@/domain/identity-access/application/repositories/roles-repository'
import { Role } from '@/domain/identity-access/enterprise/entities/role'

import { PrismaRoleMapper } from '../mappers/prisma-role-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRolesRepository implements RolesRepository {
  constructor(
    private prisma: PrismaService,
    private rolesPermissionsRepository: RolesPermissionsRepository,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      return null
    }

    return PrismaRoleMapper.toDomain(role)
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      return null
    }

    return PrismaRoleMapper.toDomain(role)
  }

  async create(role: Role): Promise<void> {
    const data = PrismaRoleMapper.toPersistency(role)

    await Promise.all([
      this.prisma.role.create({
        data,
      }),
      this.rolesPermissionsRepository.createMany(role.permissions.getItems()),
    ])
  }

  async save(role: Role): Promise<void> {
    const data = PrismaRoleMapper.toPersistency(role)

    await Promise.all([
      this.prisma.role.update({
        where: {
          id: role.id.toString(),
        },
        data,
      }),
      this.rolesPermissionsRepository.createMany(
        role.permissions.getNewItems(),
      ),
      this.rolesPermissionsRepository.deleteMany(
        role.permissions.getRemovedItems(),
      ),
    ])
  }
}
