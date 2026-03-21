import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/ondehoje/enterprise/entities/image'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeImage(override: Partial<Image> = {}, id?: UniqueEntityID) {
  const image = Image.create(
    {
      url: faker.image.url(),
      alt: faker.lorem.words(3),
      ...override,
    },
    id,
  )

  return image
}
@Injectable()
export class ImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaImage(data: Partial<ImageProps> = {}): Promise<Image> {
    const image = makeImage(data)

    await this.prisma.image.create({
      data: {
        id: image.id.toString(),
        url: image.url,
        alt: image.alt,
        createdAt: image.createdAt,
      },
    })

    return image
  }
}
