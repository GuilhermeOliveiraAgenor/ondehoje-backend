import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'
import { PaymentsRepository } from '@/domain/payment/application/repositories/payments-repository'

import { AdvertisementAuthorizationStatus } from '../../advertisement-authorization/enums/advertisement-authorization-status'
import { AdvertisementAuthorizationsRepository } from '../../advertisement-authorization/repositories/advertisement-authorizations-repository'
import { AdvertisementStatus } from '../enums/advertisement-status'
import { AdvertisementsRepository } from '../repositories/advertisements-repository'

export interface EvaluateAdvertisementUseCaseRequest {
  advertisementId: string
  approved: boolean
  rejectedReason?: string
  actor: IdentityDetails
}

type EvaluateAdvertisementUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class EvaluateAdvertisementUseCase {
  constructor(
    private advertisementsRepository: AdvertisementsRepository,
    private paymentsRepository: PaymentsRepository,
    private advertisementAuthorizationsRepository: AdvertisementAuthorizationsRepository,
  ) {}

  async execute({
    advertisementId,
    approved,
    rejectedReason,
    actor,
  }: EvaluateAdvertisementUseCaseRequest): Promise<EvaluateAdvertisementUseCaseResponse> {
    const advertisement =
      await this.advertisementsRepository.findById(advertisementId)

    if (!advertisement) {
      return failure(new ResourceNotFoundError('Advertisement'))
    }

    const requiredPermission = 'evaluate:Advertisement'
    if (!actor.permissions.has(requiredPermission)) {
      return failure(new NotAllowedError())
    }

    const payments =
      await this.paymentsRepository.findManyByAdvertisementId(advertisementId)

    let status: AdvertisementStatus = AdvertisementStatus.WAITING_PAYMENT

    if (approved && payments.length > 0) {
      status = AdvertisementStatus.ACTIVE
    } else if (!approved) {
      status = AdvertisementStatus.NOT_AUTHORIZED
    } else {
      status = AdvertisementStatus.WAITING_PAYMENT
    }

    const advertisementAuthorization = AdvertisementAuthorization.create({
      advertisementId: advertisement.id,
      status: approved
        ? AdvertisementAuthorizationStatus.AUTHORIZED
        : AdvertisementAuthorizationStatus.NOT_AUTHORIZED,
      rejectedReason: rejectedReason || null,
      decidedBy: actor.id,
    })

    await this.advertisementAuthorizationsRepository.create(
      advertisementAuthorization,
    )

    advertisement.status = status
    await this.advertisementsRepository.save(advertisement)

    return success(null)
  }
}
