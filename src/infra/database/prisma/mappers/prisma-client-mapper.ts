import { type Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaUser): Client {
    return Client.create(
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

  static toPersistency(raw: Client): Prisma.UserUncheckedCreateInput {
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
