import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'

export function getAdvertisementStatusDescription(status: string): string {
  const keys = {
    [AdvertisementStatus.WAITING_AUTHORIZATION]: 'Aguardando autorização',
    [AdvertisementStatus.WAITING_PAYMENT]: 'Aguardando pagamento',
    [AdvertisementStatus.ACTIVE]: 'Ativo',
    [AdvertisementStatus.NOT_AUTHORIZED]: 'Não autorizado',
    [AdvertisementStatus.CANCELED]: 'Cancelado',
    [AdvertisementStatus.EXPIRED]: 'Expirado',
  }

  const key = keys[status]

  return key
}
