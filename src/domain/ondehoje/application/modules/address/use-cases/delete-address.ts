import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'

import { ClientsRepository } from '../../client/repositories/clients-repository'
import { AddressesRepository } from '../repositories/addresses-repository'

interface DeleteAddressUseCaseRequest {
  clientId: Client['id']
  addressId: Address['id']
}

type DeleteAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteAddressUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    addressId,
    clientId,
  }: DeleteAddressUseCaseRequest): Promise<DeleteAddressUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId.toString())

    if (!client) {
      return failure(new ResourceNotFoundError('Client'))
    }

    const address = await this.addressesRepository.findById(
      addressId.toString(),
    )

    if (!address) {
      return failure(new ResourceNotFoundError('Address'))
    }

    if (address.createdBy.toString() !== client.id.toString()) {
      return failure(new NotAllowedError())
    }

    await this.addressesRepository.delete(address)

    return success(null)
  }
}
