import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

import { AdvertisementTypeWithSameNameError } from '../errors/advertisement-type-with-same-name-error'
import { AdvertisementTypeWithZeroDays } from '../errors/advertisement-type-with-zero-days-error'
import { AdvertisementTypeWithZeroValue } from '../errors/advertisement-type-with-zero-value-error'
import { AdvertisementTypesRepository } from '../repositories/advertisement-types-repository'

interface RegisterAdvertisementTypeRequest {
  name: AdvertisementType['name']
  description: AdvertisementType['description']
  days: AdvertisementType['days']
  value: AdvertisementType['value']
  createdBy?: string
}

type RegisterAdvertisementTypeResponse = Either<
  AdvertisementTypeWithSameNameError,
  {
    advertisementType: AdvertisementType
  }
>

export class RegisterAdvertisementTypeUseCase {
  constructor(
    private advertisementTypesRepository: AdvertisementTypesRepository,
  ) {}

  async execute({
    name,
    description,
    days,
    value,
  }: RegisterAdvertisementTypeRequest): Promise<RegisterAdvertisementTypeResponse> {
    // 1 - Advertisement Type com zero dias
    if (days === 0) {
      return failure(new AdvertisementTypeWithZeroDays(name))
    }

    // 2 - Advertisement Type com valor zero
    if (value === 0) {
      return failure(new AdvertisementTypeWithZeroValue(name))
    }

    // 3 - Advertisement Type com mesmo nome
    const nameAdvertisementType =
      await this.advertisementTypesRepository.findByName(name)

    if (nameAdvertisementType) {
      return failure(new AdvertisementTypeWithSameNameError(name))
    }

    const advertisementType = AdvertisementType.create({
      name,
      description,
      days,
      value,
      createdBy: new UniqueEntityID(),
    })

    await this.advertisementTypesRepository.create(advertisementType)

    return success({
      advertisementType,
    })
  }
}
