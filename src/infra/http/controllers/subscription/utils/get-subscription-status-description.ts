import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'

export function getSubscriptionStatusDescription(status: string): string {
  const keys = {
    [SubscriptionStatus.ACTIVE]: 'Ativa',
    [SubscriptionStatus.INACTIVE]: 'Inativa',
    [SubscriptionStatus.PENDING]: 'Pendente',
    [SubscriptionStatus.TRIAL]: 'Período de teste',
    [SubscriptionStatus.CANCELED]: 'Cancelada',
    [SubscriptionStatus.EXPIRED]: 'Expirada',
    [SubscriptionStatus.SUSPENDED]: 'Suspensa',
    [SubscriptionStatus.PAST_DUE]: 'Pagamento atrasado',
  }

  const key = keys[status]

  return key
}
