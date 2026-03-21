import { Parameter as PrismaParameter, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

export class PrismaParameterMapper {
  static toDomain(raw: PrismaParameter): Parameter {
    return Parameter.create(
      {
        key: raw.key,
        keyInfo: raw.keyInfo,
        value: raw.value,
        type: raw.type,
        status: raw.status,
        visible: raw.visible,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Parameter): Prisma.ParameterUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      key: raw.key,
      keyInfo: raw.keyInfo,
      value: raw.value,
      type: raw.type,
      status: raw.status,
      visible: raw.visible,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
    }
  }
}
