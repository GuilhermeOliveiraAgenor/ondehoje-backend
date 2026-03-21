import { Address as PrismaAddress, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        street: raw.street,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        number: raw.number,
        cep: raw.cep,
        city: raw.city,
        state: raw.state,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      },
      new UniqueEntityID(raw.id.toString()),
    )
  }

  static toPersistency(raw: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      street: raw.street,
      complement: raw.complement,
      neighborhood: raw.neighborhood,
      number: raw.number,
      cep: raw.cep,
      city: raw.city,
      state: raw.state,
      latitude: new Prisma.Decimal(raw.latitude),
      longitude: new Prisma.Decimal(raw.longitude),
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
    }
  }
}
