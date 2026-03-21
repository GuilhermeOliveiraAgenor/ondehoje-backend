import { UseCaseError } from '@/core/errors/use-case-error'

export class AddressAlreadyExistsError extends Error implements UseCaseError {
  constructor(cep: string, street: string, number: string) {
    super(
      `Address with CEP "${cep}" and street "${street}" and number "${number}" already exists.`,
    )
  }
}
