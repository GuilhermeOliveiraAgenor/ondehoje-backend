import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

import { AdvertisementTypesRepository } from '../repositories/advertisement-types-repository'

interface GetAdvertisementTypeRequest {
  advertisementTypeId: string
}

type GetAdvertisementTypeResponse = Either<
  ResourceNotFoundError,
  {
    advertisementType: AdvertisementType
  }
>

export class GetAdvertisementTypeUseCase {
  constructor(
    private advertisementTypesRepository: AdvertisementTypesRepository,
  ) {}

  async execute({
    advertisementTypeId,
  }: GetAdvertisementTypeRequest): Promise<GetAdvertisementTypeResponse> {
    const advertisementType =
      await this.advertisementTypesRepository.findById(advertisementTypeId)

    if (!advertisementType) {
      return failure(new ResourceNotFoundError('Advertisement Type'))
    }

    return success({ advertisementType })
  }
}
