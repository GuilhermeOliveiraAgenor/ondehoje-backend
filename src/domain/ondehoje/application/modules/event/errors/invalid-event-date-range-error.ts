import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidEventDateRangeError extends Error implements UseCaseError {
  constructor() {
    super('A data de início deve ser menor que a data de término.')
  }
}
