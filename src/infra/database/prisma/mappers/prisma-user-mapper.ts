import { type Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/ondehoje/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        birthDate: raw.birthDate,
        provider: raw.provider,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      password: raw.password,
      birthDate: raw.birthDate,
      provider: raw.provider,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
