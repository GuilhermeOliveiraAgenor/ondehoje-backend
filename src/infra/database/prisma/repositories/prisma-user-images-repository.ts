import { Injectable } from '@nestjs/common'

import { UserImagesRepository } from '@/domain/ondehoje/application/modules/user-image/repositories/user-images-repository'
import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'

import { PrismaUserImageMapper } from '../mappers/prisma-user-image-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserImagesRepository implements UserImagesRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByUserId(userId: string): Promise<UserImage[]> {
    const [userImages] = await this.prisma.$transaction([
      this.prisma.userImage.findMany({
        where: {
          userId,
        },
      }),
    ])

    return userImages.map(PrismaUserImageMapper.toDomain)
  }

  async createMany(images: UserImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const data = PrismaUserImageMapper.toPersistencyMany(images)

    await this.prisma.$transaction([this.prisma.userImage.createMany(data)])
  }

  async deleteMany(images: UserImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const userImagesToDelete = images.map((userImage) => {
      return {
        userId: userImage.userId.toString(),
        imageId: userImage.imageId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.userImage.deleteMany({
        where: {
          OR: userImagesToDelete,
        },
      }),
    ])
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.userImage.deleteMany({
        where: {
          userId,
        },
      }),
    ])
  }
}
