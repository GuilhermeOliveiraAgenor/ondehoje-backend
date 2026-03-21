import { Injectable } from '@nestjs/common'

import { AddressesRepository } from '@/domain/ondehoje/application/modules/address/repositories/addresses-repository'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Address | null> {
    const [address] = await this.prisma.$transaction([
      this.prisma.address.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!address) {
      return null
    }

    return PrismaAddressMapper.toDomain(address)
  }

  async findByCombination(
    createdBy: string,
    cep: string,
    street: string,
    number: string,
    complement?: string | null,
  ): Promise<Address | null> {
    const [address] = await this.prisma.$transaction([
      this.prisma.address.findFirst({
        where: {
          cep,
          street,
          number,
          complement,
          createdBy,
        },
      }),
    ])

    if (!address) {
      return null
    }

    return PrismaAddressMapper.toDomain(address)
  }

  async findMany(userId: string): Promise<Address[]> {
    const [addresses] = await this.prisma.$transaction([
      this.prisma.address.findMany({
        where: {
          createdBy: userId,
        },
      }),
    ])

    return addresses.map(PrismaAddressMapper.toDomain)
  }

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPersistency(address)

    await this.prisma.$transaction([
      this.prisma.address.create({
        data,
      }),
    ])
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPersistency(address)

    await this.prisma.$transaction([
      this.prisma.address.update({
        where: {
          id: address.id.toString(),
        },
        data,
      }),
    ])
  }

  async delete(address: Address): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.address.delete({
        where: {
          id: address.id.toString(),
        },
      }),
    ])
  }
}
