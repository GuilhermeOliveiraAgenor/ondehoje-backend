import { Either, failure, success } from '@/core/either'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'

import { HashGenerator } from '../../../cryptography/hash-generator'
import { ClientNotFoundError } from '../errors/client-not-found-error'
import { ClientsRepository } from '../repositories/clients-repository'

interface EditClientUseCaseRequest {
  clientId: string
  name?: Client['name']
  email?: Client['email']
  password?: Client['password']
  birthDate?: Client['birthDate']
}

type EditClientUseCaseResponse = Either<ClientNotFoundError, null>

export class EditClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    clientId,
    name,
    email,
    password,
    birthDate,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return failure(new ClientNotFoundError())
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)

      client.password = hashedPassword ?? client.password
    }

    client.name = name ?? client.name
    client.email = email ?? client.email
    client.birthDate = birthDate ?? client.birthDate

    await this.clientsRepository.save(client)

    return success(null)
  }
}
