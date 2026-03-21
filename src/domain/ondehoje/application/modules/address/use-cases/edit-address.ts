import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

import { ClientsRepository } from '../../client/repositories/clients-repository'
import { AddressesRepository } from '../repositories/addresses-repository'

interface EditAddressUseCaseRequest {
  clientId: string
  addressId: string
  street?: Address['street']
  number?: Address['number']
  complement?: Address['complement']
  neighborhood?: Address['neighborhood']
  city?: Address['city']
  state?: Address['state']
  cep?: Address['cep']
  longitude?: Address['longitude']
  latitude?: Address['latitude']
}

type EditAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    address: Address
  }
>

@Injectable()
export class EditAddressUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
    addressId,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    cep,
    longitude,
    latitude,
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)

    if (!address) {
      return failure(new ResourceNotFoundError('Address'))
    }

    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return failure(new ResourceNotFoundError('Client'))
    }

    if (address.createdBy.toString() !== client?.id.toString()) {
      return failure(new NotAllowedError())
    }

    address.street = street ?? address.street
    address.number = number ?? address.number
    address.complement = complement ?? address.complement
    address.neighborhood = neighborhood ?? address.neighborhood
    address.city = city ?? address.city
    address.state = state ?? address.state
    address.cep = cep ?? address.cep
    address.longitude = longitude ?? address.longitude
    address.latitude = latitude ?? address.latitude

    await this.addressesRepository.save(address)

    return success({ address })
  }
}
