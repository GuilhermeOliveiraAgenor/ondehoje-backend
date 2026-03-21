import { UseCaseError } from '@/core/errors/use-case-error'

export class InactiveSubscriptionError extends Error implements UseCaseError {
  constructor() {
    super(
      'A assinatura não está ativa. Por favor entre em contato com o suporte.',
    )
  }
}
