import { Injectable } from '@nestjs/common'

import { ImagesRepository } from '@/domain/ondehoje/application/modules/image/repositories/images-repository'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'

import { PrismaImageMapper } from '../mappers/prisma-image-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(images: Image[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const data = PrismaImageMapper.toPersistencyMany(images)

    await this.prisma.image.createMany(data)
  }
}
