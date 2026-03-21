import {
  IdentityRole as PrismaIdentityRole,
  Role as PrismaRole,
  User as PrismaIdentity,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Identity } from '@/domain/identity-access/enterprise/entities/identity'
import { IdentityRoleList } from '@/domain/identity-access/enterprise/entities/identity-role-list'

import { PrismaIdentityRoleMapper } from './prisma-identity-role-mapper'

type PrismaIdentityWithRoles = PrismaIdentity & {
  identityRoles: (PrismaIdentityRole & {
    role: PrismaRole
  })[]
}

export class PrismaIdentityMapper {
  static toDomain(raw: PrismaIdentityWithRoles): Identity {
    const domainRoles = raw.identityRoles.map((junction) => {
      return PrismaIdentityRoleMapper.toDomain(junction)
    })

    return Identity.create(
      {
        roles: new IdentityRoleList(domainRoles),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
