import { Address } from '@/domain/ondehoje/enterprise/entities/address'

export class AddressPresenter {
  static toHTTP(raw: Address) {
    return {
      id: raw.id.toString(),
      street: raw.street,
      complement: raw.complement,
      neighborhood: raw.neighborhood,
      number: raw.number,
      cep: raw.cep,
      city: raw.city,
      state: raw.state,
      longitude: raw.longitude,
      latitude: raw.latitude,
    }
  }
}
