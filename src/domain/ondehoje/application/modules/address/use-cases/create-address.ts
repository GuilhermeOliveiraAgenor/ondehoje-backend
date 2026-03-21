import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

import { AddressAlreadyExistsError } from '../errors/address-already-exists-error'
import { AddressesRepository } from '../repositories/addresses-repository'

interface CreateAddressUseCaseRequest {
  street: Address['street']
  complement?: Address['complement']
  neighborhood: Address['neighborhood']
  number: Address['number']
  cep: Address['cep']
  city: Address['city']
  state: Address['state']
  longitude: Address['longitude']
  latitude: Address['latitude']
  createdBy: string
}

type CreateAddressUseCaseResponse = Either<
  AddressAlreadyExistsError,
  {
    address: Address
  }
>

@Injectable()
export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    street,
    complement,
    neighborhood,
    number,
    cep,
    city,
    state,
    longitude,
    latitude,
    createdBy,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const addressWithSameCep = await this.addressesRepository.findByCombination(
      createdBy,
      cep,
      street,
      number,
      complement,
    )

    if (addressWithSameCep) {
      return failure(new AddressAlreadyExistsError(cep, street, number))
    }

    const address = Address.create({
      street,
      complement,
      neighborhood,
      number,
      cep,
      city,
      state,
      longitude,
      latitude,
      createdBy: new UniqueEntityID(createdBy),
    })

    await this.addressesRepository.create(address)

    return success({
      address,
    })
  }
}
