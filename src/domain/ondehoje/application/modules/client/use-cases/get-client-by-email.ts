import { Injectable } from '@nestjs/common'

import { Client } from '@/domain/ondehoje/enterprise/entities/client'

import { ClientsRepository } from '../repositories/clients-repository'

interface GetClientByEmailUseCaseRequest {
  email: Client['email']
}

@Injectable()
export class GetClientByEmailUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    email,
  }: GetClientByEmailUseCaseRequest): Promise<Client | null> {
    const client = await this.clientsRepository.findByEmail(email)

    if (!client) {
      return null
    }

    return client
  }
}
