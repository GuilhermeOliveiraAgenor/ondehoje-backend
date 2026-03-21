import { Address } from '@/domain/ondehoje/enterprise/entities/address'

export abstract class AddressesRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract findByCombination(
    userId: string,
    cep: string,
    street: string,
    number: string,
    complement?: string | null,
  ): Promise<Address | null>

  abstract findMany(userId: string): Promise<Address[]>
  abstract create(address: Address): Promise<void>
  abstract save(address: Address): Promise<void>
  abstract delete(address: Address): Promise<void>
}
