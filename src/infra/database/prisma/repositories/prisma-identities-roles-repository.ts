import { Injectable } from '@nestjs/common'

import { IdentitiesRolesRepository } from '@/domain/identity-access/application/repositories/identities-roles-repository'
import { IdentityRole } from '@/domain/identity-access/enterprise/entities/identity-role'

import { PrismaIdentityRoleMapper } from '../mappers/prisma-identity-role-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaIdentitiesRolesRepository
  implements IdentitiesRolesRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByIdentityId(identityId: string): Promise<IdentityRole[]> {
    const [identitiesRoles] = await this.prisma.$transaction([
      this.prisma.identityRole.findMany({
        where: {
          identityId,
        },
      }),
    ])

    return identitiesRoles.map(PrismaIdentityRoleMapper.toDomain)
  }

  async createMany(relations: IdentityRole[]): Promise<void> {
    if (relations.length === 0) {
      return
    }

    const data = PrismaIdentityRoleMapper.toPersistencyMany(relations)

    await this.prisma.$transaction([this.prisma.identityRole.createMany(data)])
  }

  async deleteMany(relations: IdentityRole[]): Promise<void> {
    if (relations.length === 0) {
      return
    }

    const identityRolesToDelete = relations.map((raw) => {
      return {
        roleId: raw.roleId.toString(),
        identityId: raw.identityId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.identityRole.deleteMany({
        where: {
          OR: identityRolesToDelete,
        },
      }),
    ])
  }
}
