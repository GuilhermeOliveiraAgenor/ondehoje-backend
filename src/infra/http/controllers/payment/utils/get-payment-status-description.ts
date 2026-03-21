import { PaymentStatus } from '@/domain/payment/application/enums/payment-status'

export function getPaymentStatusDescription(status: string): string {
  const keys = {
    [PaymentStatus.UNPAID]: 'Pagamento não realizado',
    [PaymentStatus.PAID]: 'Pagamento realizado',
    [PaymentStatus.PENDING]: 'Aguardando pagamento',
    [PaymentStatus.FAILED]: 'Pagamento falhou',
    [PaymentStatus.CANCELED]: 'Cancelado',
    [PaymentStatus.EXPIRED]: 'Expirado',
  }

  const key = keys[status]

  return key
}
