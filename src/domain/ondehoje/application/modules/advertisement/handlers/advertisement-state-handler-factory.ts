import { Injectable } from '@nestjs/common'

import { AdvertisementStatus } from '../enums/advertisement-status'
import { AdvertisementActiveStateHandler } from './advertisement-active-state-handler'
import { AdvertisementNotAuthorizedStateHandler } from './advertisement-not-authorized-state-handler'
import { AdvertisementStateHandler } from './advertisement-state-handler'
import { AdvertisementWaitingAuthorizationStateHandler } from './advertisement-waiting-authorization-state-handler'
import { AdvertisementWaitingPaymentStateHandler } from './advertisement-waiting-payment-state-handler'

@Injectable()
export class AdvertisementStateHandlerFactory {
  private handlers: Record<string, AdvertisementStateHandler> = {}

  constructor(
    private activeState: AdvertisementActiveStateHandler,
    private notAuthorizedState: AdvertisementNotAuthorizedStateHandler,
    private waitingPaymentState: AdvertisementWaitingPaymentStateHandler,
    private waitingAuthorizationState: AdvertisementWaitingAuthorizationStateHandler,
  ) {
    this.handlers = {
      [AdvertisementStatus.ACTIVE]: this.activeState,
      [AdvertisementStatus.NOT_AUTHORIZED]: this.notAuthorizedState,
      [AdvertisementStatus.WAITING_PAYMENT]: this.waitingPaymentState,
      [AdvertisementStatus.WAITING_AUTHORIZATION]:
        this.waitingAuthorizationState,
    }
  }

  execute(status: string): AdvertisementStateHandler | undefined {
    return this.handlers[status]
  }
}
