import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'

export abstract class AdvertisementStateHandler {
  abstract handle(advertisement: Advertisement): Promise<void>
}
