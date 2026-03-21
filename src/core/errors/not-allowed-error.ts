import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('User is not allowed to make this operation')
  }
}
