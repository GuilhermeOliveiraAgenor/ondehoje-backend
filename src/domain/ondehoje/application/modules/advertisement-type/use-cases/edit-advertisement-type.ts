import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

import { AdvertisementTypeWithSameNameError } from '../errors/advertisement-type-with-same-name-error'
import { AdvertisementTypeWithZeroDays } from '../errors/advertisement-type-with-zero-days-error'
import { AdvertisementTypeWithZeroValue } from '../errors/advertisement-type-with-zero-value-error'
import { AdvertisementTypesRepository } from '../repositories/advertisement-types-repository'

interface EditAdvertisementTypeRequest {
  name: AdvertisementType['name']
  description: AdvertisementType['description']
  days: AdvertisementType['days']
  value: AdvertisementType['value']
  advertisementTypeId: string
}

type EditAdvertisementTypeResponse = Either<
  | ResourceNotFoundError
  | AdvertisementTypeWithZeroDays
  | AdvertisementTypeWithZeroValue
  | AdvertisementTypeWithSameNameError,
  {
    advertisementType: AdvertisementType
  }
>

export class EditAdvertisementTypeUseCase {
  constructor(
    private advertisementTypesRepository: AdvertisementTypesRepository,
  ) {}

  async execute({
    name,
    description,
    days,
    value,
    advertisementTypeId,
  }: EditAdvertisementTypeRequest): Promise<EditAdvertisementTypeResponse> {
    const advertisementType =
      await this.advertisementTypesRepository.findById(advertisementTypeId)

    if (!advertisementType) {
      return failure(new ResourceNotFoundError('Advertisement Type'))
    }

    if (days === 0) {
      return failure(new AdvertisementTypeWithZeroDays(name))
    }

    if (value === 0) {
      return failure(new AdvertisementTypeWithZeroValue(name))
    }

    const nameAdvertisementType =
      await this.advertisementTypesRepository.findByName(name)

    if (nameAdvertisementType) {
      return failure(new AdvertisementTypeWithSameNameError(name))
    }

    advertisementType.name = name ?? advertisementType.name
    advertisementType.description = description ?? advertisementType.description
    advertisementType.days = days ?? advertisementType.days
    advertisementType.value = value ?? advertisementType.value

    await this.advertisementTypesRepository.save(advertisementType)

    return success({
      advertisementType,
    })
  }
}
