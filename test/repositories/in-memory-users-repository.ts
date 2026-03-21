import { UsersRepository } from '@/domain/ondehoje/application/modules/user/repositories/users-repository'
import { User } from '@/domain/ondehoje/enterprise/entities/user'
import { UserDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-details'

import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryUserImagesRepository } from './in-memory-user-images-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  constructor(
    private imagesRepository: InMemoryImagesRepository,
    private userImagesRepository: InMemoryUserImagesRepository,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findDetailsById(id: string): Promise<UserDetails | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    const userImage = this.userImagesRepository.items.find(
      (userImage) => userImage.userId.toString() === id,
    )

    const image = this.imagesRepository.items.find(
      (image) => image.id.toString() === userImage?.imageId.toString(),
    )

    const userDetails = UserDetails.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
      provider: user.provider,
      image: image?.url ?? '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })

    return userDetails
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)

    await this.userImagesRepository.createMany(user.images.getItems())
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user

    await this.userImagesRepository.createMany(user.images.getNewItems())
    await this.userImagesRepository.deleteMany(user.images.getRemovedItems())
  }
}
