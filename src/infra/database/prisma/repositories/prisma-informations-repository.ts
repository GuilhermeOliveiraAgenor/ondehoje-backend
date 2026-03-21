import { Injectable } from '@nestjs/common'

import { InformationsRepository } from '@/domain/ondehoje/application/modules/information/repositories/informations-repository'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

import { PrismaInformationMapper } from '../mappers/prisma-information-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaInformationsRepository implements InformationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Information | null> {
    const [information] = await this.prisma.$transaction([
      this.prisma.information.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!information) {
      return null
    }

    return PrismaInformationMapper.toDomain(information)
  }

  async findManyByEventId(eventId: string): Promise<Information[]> {
    const [informations] = await this.prisma.$transaction([
      this.prisma.information.findMany({
        where: {
          eventId,
        },
      }),
    ])

    return informations.map(PrismaInformationMapper.toDomain)
  }

  async findManyByCompanyId(companyId: string): Promise<Information[]> {
    const [informations] = await this.prisma.$transaction([
      this.prisma.information.findMany({
        where: {
          companyId,
        },
      }),
    ])

    return informations.map(PrismaInformationMapper.toDomain)
  }

  async createMany(informations: Information[]): Promise<void> {
    if (informations.length === 0) {
      return
    }

    const data = informations.map(PrismaInformationMapper.toPersistency)

    await this.prisma.$transaction([
      this.prisma.information.createMany({
        data,
      }),
    ])
  }

  async save(information: Information): Promise<void> {
    const data = PrismaInformationMapper.toPersistency(information)

    await this.prisma.$transaction([
      this.prisma.information.update({
        where: {
          id: information.id.toString(),
        },
        data,
      }),
    ])
  }

  async delete(information: Information): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.information.delete({
        where: {
          id: information.id.toString(),
        },
      }),
    ])
  }
}
