import { type Prisma, UserImage as PrismaUserImage } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'

export class PrismaUserImageMapper {
  static toDomain(raw: PrismaUserImage): UserImage {
    return UserImage.create({
      userId: new UniqueEntityID(raw.userId),
      imageId: new UniqueEntityID(raw.imageId),
    })
  }

  static toPersistencyMany(raw: UserImage[]): Prisma.UserImageCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        userId: raw.userId.toString(),
        imageId: raw.imageId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
