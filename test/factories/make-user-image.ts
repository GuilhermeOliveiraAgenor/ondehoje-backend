import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'

export function makeUserImage(
  override: Partial<UserImage> = {},
  id?: UniqueEntityID,
) {
  const userImage = UserImage.create(
    {
      imageId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return userImage
}
