import { Either, success } from '@/core/either'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

import { AdvertisementTypesRepository } from '../repositories/advertisement-types-repository'

type FetchAdvertisementTypesUseCaseResponse = Either<
  null,
  {
    advertisementTypes: AdvertisementType[]
  }
>

export class FetchAdvertisementTypesUseCase {
  constructor(
    private advertisementTypesRepository: AdvertisementTypesRepository,
  ) {}

  async execute(): Promise<FetchAdvertisementTypesUseCaseResponse> {
    const advertisementTypes =
      await this.advertisementTypesRepository.findMany()

    return success({
      advertisementTypes,
    })
  }
}
