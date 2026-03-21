import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import { PaymentStatus } from '@/domain/payment/application/enums/payment-status'

import { paymentStatusByProvider } from '../enum/payment-status-by-provider'

export function mappingExternalPaymentStatusToInternal(
  provider: PaymentProvider,
  externalStatus: string,
): PaymentStatus {
  const providerMap = paymentStatusByProvider[provider]

  if (!providerMap) {
    throw new Error(`Payment provider "${provider}" not supported`)
  }

  const internalStatus = providerMap[externalStatus]

  if (!internalStatus) {
    // fallback seguro
    return PaymentStatus.PENDING
  }

  return internalStatus as PaymentStatus
}
