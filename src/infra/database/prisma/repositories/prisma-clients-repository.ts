import { Injectable } from '@nestjs/common'

import { ClientsRepository } from '@/domain/ondehoje/application/modules/client/repositories/clients-repository'
import { UserImagesRepository } from '@/domain/ondehoje/application/modules/user-image/repositories/user-images-repository'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'

import { PrismaClientMapper } from '../mappers/prisma-client-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(
    private prisma: PrismaService,
    private userImagesRepository: UserImagesRepository,
  ) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const [client] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          email,
        },
      }),
    ])

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistency(client)

    await this.prisma.$transaction([
      this.prisma.user.create({
        data,
      }),
    ])

    await this.userImagesRepository.createMany(client.images.getItems())
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistency(client)

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: client.id.toString(),
        },
        data,
      }),
      this.userImagesRepository.createMany(client.images.getNewItems()),
      this.userImagesRepository.deleteMany(client.images.getRemovedItems()),
    ])
  }
}
