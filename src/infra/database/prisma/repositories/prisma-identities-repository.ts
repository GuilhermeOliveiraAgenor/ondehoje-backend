import { Injectable } from '@nestjs/common'

import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { IdentitiesRolesRepository } from '@/domain/identity-access/application/repositories/identities-roles-repository'
import { Identity } from '@/domain/identity-access/enterprise/entities/identity'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

import { PrismaIdentityDetailsMapper } from '../mappers/prisma-identity-details-mapper'
import { PrismaIdentityMapper } from '../mappers/prisma-identity-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaIdentitiesRepository implements IdentitiesRepository {
  constructor(
    private prisma: PrismaService,
    private identitiesRolesRepository: IdentitiesRolesRepository,
  ) {}

  async findById(id: string): Promise<Identity | null> {
    const [identity] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          identityRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
    ])

    if (!identity) {
      return null
    }

    return PrismaIdentityMapper.toDomain(identity)
  }

  async findIdentityDetailsById(id: string): Promise<IdentityDetails | null> {
    const [identity] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          userImages: {
            include: {
              image: true,
            },
          },
          identityRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ])

    if (!identity) {
      return null
    }

    return PrismaIdentityDetailsMapper.toDomain(identity)
  }

  async findManyWithPermission(
    action: string,
    entity: string,
  ): Promise<IdentityDetails[]> {
    const [users] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          identityRoles: {
            some: {
              role: {
                rolePermissions: {
                  some: {
                    permission: {
                      action,
                      entity,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          userImages: {
            include: {
              image: true,
            },
          },
          identityRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ])

    return users.map(PrismaIdentityDetailsMapper.toDomain)
  }

  async create(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(identity: Identity): Promise<void> {
    await Promise.all([
      this.identitiesRolesRepository.createMany(identity.roles.getNewItems()),
      this.identitiesRolesRepository.deleteMany(
        identity.roles.getRemovedItems(),
      ),
    ])
  }
}
