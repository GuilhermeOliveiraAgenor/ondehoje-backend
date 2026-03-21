import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { PaymentsRepository } from '../repositories/payments-repository'

interface FetchPaymentsByAdvertisementIdUseCaseRequest {
  advertisementId: string
}

type FetchPaymentsByAdvertisementIdUseCaseResponse = Either<
  null,
  {
    payments: Payment[]
  }
>

@Injectable()
export class FetchPaymentsByAdvertisementIdUseCase {
  constructor(private paymentRepository: PaymentsRepository) {}

  async execute({
    advertisementId,
  }: FetchPaymentsByAdvertisementIdUseCaseRequest): Promise<FetchPaymentsByAdvertisementIdUseCaseResponse> {
    const payments =
      await this.paymentRepository.findManyByAdvertisementId(advertisementId)

    return success({
      payments,
    })
  }
}
