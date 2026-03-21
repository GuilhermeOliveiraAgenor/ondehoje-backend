import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'
import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'
import { UserImageList } from '@/domain/ondehoje/enterprise/entities/user-image-list'

import { HashGenerator } from '../../../cryptography/hash-generator'
import { ImagesRepository } from '../../image/repositories/images-repository'
import { UserImagesRepository } from '../../user-image/repositories/user-images-repository'
import { ClientAlreadyExistsError } from '../errors/client-already-exists-error'
import { ClientsRepository } from '../repositories/clients-repository'

interface CreateClientUseCaseRequest {
  name: Client['name']
  email: Client['email']
  password: Client['password']
  birthDate: Client['birthDate']
  provider: Client['provider']
  imageUrl: string
}

type CreateClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

@Injectable()
export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
    private imagesRepository: ImagesRepository,
    private userImagesRepository: UserImagesRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    birthDate,
    provider,
    imageUrl,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if (clientWithSameEmail) {
      return failure(new ClientAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      email,
      password: hashedPassword,
      birthDate,
      provider,
    })

    const image = Image.create({
      url: imageUrl,
    })

    const userImage = UserImage.create({
      imageId: image.id,
      userId: client.id,
    })

    client.images = new UserImageList([userImage])

    await Promise.all([
      this.imagesRepository.createMany([image]),
      this.clientsRepository.create(client),
    ])

    return success({
      client,
    })
  }
}
