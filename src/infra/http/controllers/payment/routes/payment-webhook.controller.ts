import { Controller, Post, Req } from '@nestjs/common'
import type { Request } from 'express'

import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import { ProcessPaymentWebhookUseCase } from '@/domain/payment/application/use-cases/process-payment-webhook'
import { Public } from '@/infra/auth/decorators/public'

import { mappingExternalPaymentStatusToInternal } from '../mapping/mapping-external-payment-status-to-internal'

interface WebhookRequest {
  body: {
    data: {
      object: {
        metadata: {
          paymentId: string
        }
        status: string
      }
    }
  }
}

@Controller('/webhook')
@Public()
export class PaymentWebhookController {
  constructor(private processPaymentWebhook: ProcessPaymentWebhookUseCase) {}

  @Post()
  async handle(@Req() request: Request) {
    const { body } = request as WebhookRequest

    const paymentId = body.data.object.metadata.paymentId
    const status = body.data.object.status

    if (!paymentId) {
      console.error('Payment ID not found in webhook metadata')
      return
    }

    const mappedStatus = mappingExternalPaymentStatusToInternal(
      PaymentProvider.STRIPE,
      status,
    )

    const result = await this.processPaymentWebhook.execute({
      paymentId,
      status: mappedStatus,
    })

    if (result.isError()) {
      const error = result.value

      console.error('Error processing payment webhook:', error)
    }
  }
}
