import { Address } from '@/domain/ondehoje/enterprise/entities/address'

export class AddressLocationPresenter {
  static toHTTP(raw: Address) {
    return {
      neighborhood: raw.neighborhood,
      city: raw.city,
      state: raw.state,
    }
  }
}
