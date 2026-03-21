import { Module } from '@nestjs/common'

import { FetchPaymentsByAdvertisementIdUseCase } from '@/domain/payment/application/use-cases/fetch-payments-by-advertisement-id'
import { FetchPaymentsBySubscriptionIdUseCase } from '@/domain/payment/application/use-cases/fetch-payments-by-subscription-id'
import { GetPaymentByCheckoutIdUseCase } from '@/domain/payment/application/use-cases/get-payment-by-checkout-id'
import { ProcessPaymentWebhookUseCase } from '@/domain/payment/application/use-cases/process-payment-webhook'
import { DatabaseModule } from '@/infra/database/database.module'

import { FetchPaymentsByAdvertisementIdController } from './routes/fetch-payments-by-advertisement-id.controller'
import { FetchPaymentsBySubscriptionIdController } from './routes/fetch-payments-by-subscription-id.controller'
import { GetPaymentByCheckoutIdController } from './routes/get-payment-by-checkout-id.controller'
import { PaymentWebhookController } from './routes/payment-webhook.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    PaymentWebhookController,
    FetchPaymentsBySubscriptionIdController,
    FetchPaymentsByAdvertisementIdController,
    GetPaymentByCheckoutIdController,
  ],
  providers: [
    ProcessPaymentWebhookUseCase,
    FetchPaymentsBySubscriptionIdUseCase,
    FetchPaymentsByAdvertisementIdUseCase,
    GetPaymentByCheckoutIdUseCase,
  ],
})
export class HttpPaymentModule {}
