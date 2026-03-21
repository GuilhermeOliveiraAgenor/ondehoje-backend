import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

import { AddressesRepository } from '../repositories/addresses-repository'

interface ListAddressesUseCaseRequest {
  userId: string
}

type ListAddressesUseCaseResponse = Either<null, { addresses: Address[] }>

@Injectable()
export class ListAddressesUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    userId,
  }: ListAddressesUseCaseRequest): Promise<ListAddressesUseCaseResponse> {
    const addresses = await this.addressesRepository.findMany(userId)

    return success({ addresses })
  }
}
