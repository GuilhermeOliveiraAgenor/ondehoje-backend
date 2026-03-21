import { IdentityRole as PrismaIdentityRole, type Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { IdentityRole } from '@/domain/identity-access/enterprise/entities/identity-role'

export class PrismaIdentityRoleMapper {
  static toDomain(raw: PrismaIdentityRole): IdentityRole {
    return IdentityRole.create({
      roleId: new UniqueEntityID(raw.roleId),
      identityId: new UniqueEntityID(raw.identityId),
    })
  }

  static toPersistencyMany(
    raw: IdentityRole[],
  ): Prisma.IdentityRoleCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        roleId: raw.roleId.toString(),
        identityId: raw.identityId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
