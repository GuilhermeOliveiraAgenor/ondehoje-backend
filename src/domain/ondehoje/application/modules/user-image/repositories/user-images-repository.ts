import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'

export abstract class UserImagesRepository {
  abstract findManyByUserId(userId: string): Promise<UserImage[]>
  abstract createMany(images: UserImage[]): Promise<void>
  abstract deleteMany(images: UserImage[]): Promise<void>
  abstract deleteManyByUserId(userId: string): Promise<void>
}
