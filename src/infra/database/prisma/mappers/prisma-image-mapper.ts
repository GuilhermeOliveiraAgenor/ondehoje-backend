import { Image as PrismaImage, type Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'

export class PrismaImageMapper {
  static toDomain(raw: PrismaImage): Image {
    return Image.create(
      {
        url: raw.url,
        alt: raw.alt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistencyMany(raw: Image[]): Prisma.ImageCreateManyArgs {
    return {
      data: raw.map((image) => ({
        id: image.id.toString(),
        url: image.url,
        alt: image.alt,
        createdAt: image.createdAt,
      })),
      skipDuplicates: true,
    }
  }
}
