import { UseCaseError } from '@/core/errors/use-case-error'

export class OutstandingPaymentError extends Error implements UseCaseError {
  constructor() {
    super('Existe um pagamento pendente para esta assinatura.')
  }
}
