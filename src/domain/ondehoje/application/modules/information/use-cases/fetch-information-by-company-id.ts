import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

import { InformationsRepository } from '../repositories/informations-repository'

interface FetchInformationByCompanyIdRequest {
  companyId: string
}

type FetchInformationByCompanyIdResponse = Either<
  null,
  {
    informations: Information[]
  }
>
@Injectable()
export class FetchInformationByCompanyIdUseCase {
  constructor(private informationsRepository: InformationsRepository) {}

  async execute({
    companyId,
  }: FetchInformationByCompanyIdRequest): Promise<FetchInformationByCompanyIdResponse> {
    const informations =
      await this.informationsRepository.findManyByCompanyId(companyId)

    return success({
      informations,
    })
  }
}
