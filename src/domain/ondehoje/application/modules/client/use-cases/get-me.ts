import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

interface GetMeUseCaseRequest {
  requestedBy: IdentityDetails['id']
}

type GetMeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    client: IdentityDetails
  }
>

@Injectable()
export class GetMeUseCase {
  constructor(private identitiesRepository: IdentitiesRepository) {}

  async execute({
    requestedBy,
  }: GetMeUseCaseRequest): Promise<GetMeUseCaseResponse> {
    const client = await this.identitiesRepository.findIdentityDetailsById(
      requestedBy.toString(),
    )

    if (!client) {
      return failure(new ResourceNotFoundError('Client'))
    }

    return success({
      client,
    })
  }
}
