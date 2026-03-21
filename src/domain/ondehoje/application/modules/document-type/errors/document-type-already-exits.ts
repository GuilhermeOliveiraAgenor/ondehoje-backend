import { UseCaseError } from '@/core/errors/use-case-error'

export class DocumentTypeWithSameName extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Document type "${identifier}" already exists.`)
  }
}
