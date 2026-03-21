import { AddressesRepository } from '@/domain/ondehoje/application/modules/address/repositories/addresses-repository'
import { Address } from '@/domain/ondehoje/enterprise/entities/address'

export class InMemoryAddressesRepository implements AddressesRepository {
  public items: Address[] = []

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id.toString() === id)

    if (!address) {
      return null
    }

    return address
  }

  async findByCombination(
    createdBy: string,
    cep: string,
    street: string,
    number: string,
    complement?: string | null,
  ): Promise<Address | null> {
    const address = this.items.find(
      (item) =>
        item.createdBy.toString() === createdBy &&
        item.cep === cep &&
        item.street === street &&
        item.number === number &&
        item.complement === complement,
    )

    if (!address) {
      return null
    }

    return address
  }

  async findMany(userId: string): Promise<Address[]> {
    return this.items.filter((item) => item.createdBy.toString() === userId)
  }

  async create(address: Address) {
    this.items.push(address)
  }

  async save(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items[itemIndex] = address
  }

  async delete(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items.splice(itemIndex, 1)
  }
}
