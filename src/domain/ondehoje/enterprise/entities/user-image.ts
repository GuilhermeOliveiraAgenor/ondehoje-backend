import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserImageProps {
  userId: UniqueEntityID
  imageId: UniqueEntityID
}

export class UserImage extends Entity<UserImageProps> {
  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
  }

  get imageId() {
    return this.props.imageId
  }

  set imageId(imageId: UniqueEntityID) {
    this.props.imageId = imageId
  }

  static create(props: UserImageProps, id?: UniqueEntityID) {
    const userImage = new UserImage(props, id)

    return userImage
  }
}
