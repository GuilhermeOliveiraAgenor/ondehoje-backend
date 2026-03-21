import {
  IdentityRole as PrismaIdentityRole,
  Image as PrismaImage,
  Permission as PrismaPermission,
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
  User as PrismaUser,
  UserImage as PrismaUserImage,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

type PrismaIdentityDetails = PrismaUser & {
  userImages: (PrismaUserImage & {
    image: PrismaImage
  })[]
  identityRoles: (PrismaIdentityRole & {
    role: PrismaRole & {
      rolePermissions: (PrismaRolePermission & {
        permission: PrismaPermission
      })[]
    }
  })[]
}

export class PrismaIdentityDetailsMapper {
  static toDomain(raw: PrismaIdentityDetails): IdentityDetails {
    const roles = new Set<string>()
    const permissions = new Set<string>()

    const images = raw.userImages.map((userImage) => {
      return {
        id: userImage.image.id,
        url: userImage.image.url,
        alt: userImage.image.alt,
      }
    })

    // Itera sobre as relações de 'identity' para 'role'
    for (const identityRole of raw.identityRoles) {
      const role = identityRole.role
      roles.add(role.name)

      // Itera sobre as relações de 'role' para 'permission'
      for (const rolePermission of role.rolePermissions) {
        const perm = rolePermission.permission

        const permissionName = `${perm.action}:${perm.entity}`
        permissions.add(permissionName)
      }
    }

    return IdentityDetails.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      email: raw.email,
      birthDate: raw.birthDate,
      provider: raw.provider,
      image: images.length > 0 ? images[0].url : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      roles,
      permissions,
    })
  }
}
