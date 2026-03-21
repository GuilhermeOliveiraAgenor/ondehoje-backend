import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/ondehoje/application/modules/user/repositories/users-repository'
import { UserImagesRepository } from '@/domain/ondehoje/application/modules/user-image/repositories/user-images-repository'
import { User } from '@/domain/ondehoje/enterprise/entities/user'
import type { UserDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-details'

import { PrismaUserDetailsMapper } from '../mappers/prisma-user-details-mapper'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    private prisma: PrismaService,
    private userImagesRepository: UserImagesRepository,
  ) {}

  async findById(id: string): Promise<User | null> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findDetailsById(id: string): Promise<UserDetails | null> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          userImages: {
            include: {
              image: true,
            },
          },
        },
      }),
    ])

    if (!user) {
      return null
    }

    return PrismaUserDetailsMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          email,
        },
      }),
    ])

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistency(user)

    await this.prisma.$transaction([
      this.prisma.user.create({
        data,
      }),
    ])

    await this.userImagesRepository.createMany(user.images.getItems())
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistency(user)

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: user.id.toString(),
        },
        data,
      }),
      this.userImagesRepository.createMany(user.images.getNewItems()),
      this.userImagesRepository.deleteMany(user.images.getRemovedItems()),
    ])
  }
}
