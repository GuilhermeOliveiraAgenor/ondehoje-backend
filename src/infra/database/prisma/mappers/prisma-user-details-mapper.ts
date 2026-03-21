import {
  Image as PrismaImage,
  User as PrismaUser,
  UserImage as PrismaUserImage,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-details'

type PrismaUserDetails = PrismaUser & {
  userImages: (PrismaUserImage & {
    image: PrismaImage
  })[]
}

export class PrismaUserDetailsMapper {
  static toDomain(raw: PrismaUserDetails): UserDetails {
    const images = raw.userImages.map((userImage) => {
      return {
        id: userImage.image.id,
        url: userImage.image.url,
        alt: userImage.image.alt,
      }
    })

    return UserDetails.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      email: raw.email,
      password: raw.password,
      birthDate: raw.birthDate,
      provider: raw.provider,
      image: images.length > 0 ? images[0].url : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
