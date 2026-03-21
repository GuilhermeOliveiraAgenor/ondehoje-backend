import { Module } from '@nestjs/common'

import { OnAdvertisementCreated } from '@/domain/notification/application/subscribers/on-advertisement-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { AdvertisementActiveStateHandler } from '@/domain/ondehoje/application/modules/advertisement/handlers/advertisement-active-state-handler'
import { AdvertisementNotAuthorizedStateHandler } from '@/domain/ondehoje/application/modules/advertisement/handlers/advertisement-not-authorized-state-handler'
import { AdvertisementStateHandlerFactory } from '@/domain/ondehoje/application/modules/advertisement/handlers/advertisement-state-handler-factory'
import { AdvertisementWaitingAuthorizationStateHandler } from '@/domain/ondehoje/application/modules/advertisement/handlers/advertisement-waiting-authorization-state-handler'
import { AdvertisementWaitingPaymentStateHandler } from '@/domain/ondehoje/application/modules/advertisement/handlers/advertisement-waiting-payment-state-handler'
import { OnAdvertisementChanged } from '@/domain/ondehoje/application/subscribers/on-advertisement-changed'
import { OnSubscriptionRenewed } from '@/domain/payment/application/subscribers/on-subscription-renewed'
import { CreatePaymentUseCase } from '@/domain/payment/application/use-cases/create-payment'

import { DatabaseModule } from '../database/database.module'
import { NotifierModule } from '../notifier/notifier.module'
import { PaymentModule } from '../payment/payment.module'

@Module({
  imports: [DatabaseModule, NotifierModule, PaymentModule],
  providers: [
    OnAdvertisementCreated,
    OnSubscriptionRenewed,
    CreatePaymentUseCase,
    SendNotificationUseCase,
    OnAdvertisementChanged,
    AdvertisementStateHandlerFactory,
    AdvertisementActiveStateHandler,
    AdvertisementNotAuthorizedStateHandler,
    AdvertisementWaitingPaymentStateHandler,
    AdvertisementWaitingAuthorizationStateHandler,
  ],
  exports: [
    OnAdvertisementCreated,
    OnSubscriptionRenewed,
    OnAdvertisementChanged,
  ],
})
export class EventsModule {}
