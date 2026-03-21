import { Injectable } from '@nestjs/common'

import { ParametersRepository } from '@/domain/ondehoje/application/modules/parameter/repositories/parameters-repository'
import { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

import { PrismaParameterMapper } from '../mappers/prisma-parameter-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaParametersRepository implements ParametersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Parameter | null> {
    const [parameter] = await this.prisma.$transaction([
      this.prisma.parameter.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!parameter) {
      return null
    }

    return PrismaParameterMapper.toDomain(parameter)
  }

  async findByKey(key: string): Promise<Parameter | null> {
    const [parameter] = await this.prisma.$transaction([
      this.prisma.parameter.findUnique({
        where: {
          key,
        },
      }),
    ])

    if (!parameter) {
      return null
    }

    return PrismaParameterMapper.toDomain(parameter)
  }

  async findMany(): Promise<Parameter[]> {
    const [parameters] = await this.prisma.$transaction([
      this.prisma.parameter.findMany(),
    ])

    return parameters.map(PrismaParameterMapper.toDomain)
  }

  async create(parameter: Parameter): Promise<void> {
    const data = PrismaParameterMapper.toPersistency(parameter)

    await this.prisma.$transaction([
      this.prisma.parameter.create({
        data,
      }),
    ])
  }

  async save(parameter: Parameter): Promise<void> {
    const data = PrismaParameterMapper.toPersistency(parameter)

    await this.prisma.$transaction([
      this.prisma.parameter.update({
        where: {
          id: parameter.id.toString(),
        },
        data,
      }),
    ])
  }
}
