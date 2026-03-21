import { type Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { PaymentStatus } from '../enums/payment-status'
import { PaymentsRepository } from '../repositories/payments-repository'

interface EditPaymentUseCaseRequest {
  gateway?: string | null
  checkoutId?: string | null
  status?: string
  pixData?: string
  finalCard?: string
}

type EditPaymentUseCaseResponse = Either<ResourceNotFoundError, null>

export class EditPaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    gateway,
    checkoutId,
    status,
    pixData,
    finalCard,
  }: EditPaymentUseCaseRequest): Promise<EditPaymentUseCaseResponse> {
    const payment = await this.paymentsRepository.findByGatewayAndCheckoutId(
      gateway,
      checkoutId,
    )

    if (!payment) {
      return failure(new ResourceNotFoundError('Payment'))
    }

    payment.status = status ?? payment.status

    if (payment.status === PaymentStatus.PAID) {
      payment.confirmationDate = new Date()
    }

    payment.pixData = pixData ?? payment.pixData
    payment.finalCard = finalCard ?? payment.finalCard

    await this.paymentsRepository.save(payment)

    return success(null)
  }
}
