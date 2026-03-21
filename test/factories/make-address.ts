import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/ondehoje/enterprise/entities/address'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
    {
      street: faker.location.street(),
      complement: faker.location.secondaryAddress(),
      neighborhood: faker.location.county(),
      number: faker.location.buildingNumber(),
      cep: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return address
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const address = makeAddress(data)

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPersistency(address),
    })

    return address
  }
}
