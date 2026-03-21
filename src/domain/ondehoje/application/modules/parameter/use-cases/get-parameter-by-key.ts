import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

import { ParametersRepository } from '../repositories/parameters-repository'

interface GetParameterByKeyUseCaseRequest {
  key: string
}

type GetParameterByKeyUseCaseResponse = Either<
  null,
  {
    parameter: Parameter | null
  }
>

@Injectable()
export class GetParameterByKeyUseCase {
  constructor(private parametersRepository: ParametersRepository) {}

  async execute({
    key,
  }: GetParameterByKeyUseCaseRequest): Promise<GetParameterByKeyUseCaseResponse> {
    const parameter = await this.parametersRepository.findByKey(key)

    return success({
      parameter,
    })
  }
}
